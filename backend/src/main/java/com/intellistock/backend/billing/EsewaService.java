package com.intellistock.backend.billing;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.intellistock.backend.billing.dto.EsewaFormResponse;
import com.intellistock.backend.common.exception.AppException;
import com.intellistock.backend.warehouse.Plan;
import com.intellistock.backend.warehouse.Warehouse;
import com.intellistock.backend.warehouse.WarehouseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;

/**
 * eSewa ePay v2 integration. Sandbox defaults (product code EPAYTEST + the
 * public test secret) work out of the box; override via env for production.
 * Docs flow: POST a signed form to eSewa → user pays → eSewa redirects to our
 * success/failure URL with a base64 `data` blob we verify by re-signing.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EsewaService {

    private final PaymentRepository paymentRepository;
    private final WarehouseRepository warehouseRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${esewa.product-code:EPAYTEST}")
    private String productCode;

    @Value("${esewa.secret-key:8gBm/:&EnhH.1/q}")
    private String secretKey;

    @Value("${esewa.form-url:https://rc-epay.esewa.com.np/api/epay/main/v2/form}")
    private String formUrl;

    @Value("${esewa.pro-price:1000}")
    private String proPrice;

    @Value("${app.base-url:http://localhost:8080}")
    private String backendBaseUrl;

    /** Builds the signed form fields for the current warehouse's Pro upgrade. */
    @Transactional
    public EsewaFormResponse initiate(Long warehouseId) {
        String txnUuid = UUID.randomUUID().toString();
        paymentRepository.save(Payment.builder()
                .warehouseId(warehouseId)
                .transactionUuid(txnUuid)
                .amount(new BigDecimal(proPrice))
                .status(PaymentStatus.PENDING)
                .build());

        String totalAmount = proPrice;
        // signed_field_names order MUST match the message order below.
        String message = "total_amount=" + totalAmount
                + ",transaction_uuid=" + txnUuid
                + ",product_code=" + productCode;
        String signature = sign(message);

        Map<String, String> fields = new LinkedHashMap<>();
        fields.put("amount", proPrice);
        fields.put("tax_amount", "0");
        fields.put("total_amount", totalAmount);
        fields.put("transaction_uuid", txnUuid);
        fields.put("product_code", productCode);
        fields.put("product_service_charge", "0");
        fields.put("product_delivery_charge", "0");
        fields.put("success_url", backendBaseUrl + "/api/v1/billing/esewa/success");
        fields.put("failure_url", backendBaseUrl + "/api/v1/billing/esewa/failure");
        fields.put("signed_field_names", "total_amount,transaction_uuid,product_code");
        fields.put("signature", signature);

        log.info("[eSewa] Initiated payment {} for warehouse {}", txnUuid, warehouseId);
        return new EsewaFormResponse(formUrl, fields);
    }

    /**
     * Verifies the base64 `data` blob eSewa returns on success and, if valid,
     * marks the payment COMPLETE and upgrades the warehouse to PRO.
     * Returns the transaction uuid (idempotent — safe to call twice).
     */
    @Transactional
    public void handleSuccess(String encodedData) {
        JsonNode data = decode(encodedData);
        String status = data.path("status").asText();
        String txnUuid = data.path("transaction_uuid").asText();
        String totalAmount = data.path("total_amount").asText();

        if (!"COMPLETE".equals(status)) {
            throw new AppException("Payment not complete: " + status);
        }

        // Re-sign the fields eSewa says it signed and compare.
        String signedNames = data.path("signed_field_names").asText();
        StringBuilder msg = new StringBuilder();
        for (String name : signedNames.split(",")) {
            if (msg.length() > 0) msg.append(",");
            msg.append(name).append("=").append(data.path(name).asText());
        }
        String expected = sign(msg.toString());
        if (!expected.equals(data.path("signature").asText())) {
            log.warn("[eSewa] Signature mismatch for txn {}", txnUuid);
            throw new AppException("Invalid payment signature", HttpStatus.BAD_REQUEST);
        }

        Payment payment = paymentRepository.findByTransactionUuid(txnUuid)
                .orElseThrow(() -> new AppException("Unknown transaction"));

        if (payment.getStatus() == PaymentStatus.COMPLETE) return; // idempotent

        // Amount tampering guard.
        if (payment.getAmount().compareTo(new BigDecimal(totalAmount.replace(",", ""))) != 0) {
            throw new AppException("Payment amount mismatch", HttpStatus.BAD_REQUEST);
        }

        payment.setStatus(PaymentStatus.COMPLETE);
        payment.setEsewaRef(data.path("transaction_code").asText());

        Warehouse warehouse = warehouseRepository.findById(payment.getWarehouseId())
                .orElseThrow(() -> new AppException("Warehouse not found"));
        warehouse.setPlan(Plan.PRO);
        log.info("[eSewa] Warehouse {} upgraded to PRO (txn {})", warehouse.getId(), txnUuid);
    }

    @Transactional
    public void handleFailure(String txnUuid) {
        if (txnUuid == null) return;
        paymentRepository.findByTransactionUuid(txnUuid).ifPresent(p -> {
            if (p.getStatus() == PaymentStatus.PENDING) p.setStatus(PaymentStatus.FAILED);
        });
    }

    private JsonNode decode(String encoded) {
        try {
            byte[] json = Base64.getDecoder().decode(encoded);
            return objectMapper.readTree(json);
        } catch (Exception e) {
            throw new AppException("Malformed payment response", HttpStatus.BAD_REQUEST);
        }
    }

    private String sign(String message) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            return Base64.getEncoder().encodeToString(mac.doFinal(message.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception e) {
            throw new IllegalStateException("Failed to sign eSewa payload", e);
        }
    }
}
