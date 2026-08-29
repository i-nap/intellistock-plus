package com.intellistock.backend.order;

import com.intellistock.backend.common.constants.InventoryMovementType;
import com.intellistock.backend.common.exception.AppException;
import com.intellistock.backend.common.exception.ResourceNotFoundException;
import com.intellistock.backend.common.tenant.TenantContext;
import com.intellistock.backend.inventory.InventoryLog;
import com.intellistock.backend.inventory.InventoryLogRepository;
import com.intellistock.backend.notification.NotificationService;
import com.intellistock.backend.notification.NotificationType;
import com.intellistock.backend.inventory.InventoryRepository;
import com.intellistock.backend.order.dto.CreateOrderRequest;
import com.intellistock.backend.order.dto.OrderResponse;
import com.intellistock.backend.order.dto.UpdateOrderStatusRequest;
import com.intellistock.backend.order.mapper.OrderMapper;
import com.intellistock.backend.product.Product;
import com.intellistock.backend.product.ProductRepository;
import com.intellistock.backend.supplier.Supplier;
import com.intellistock.backend.supplier.SupplierRepository;
import com.intellistock.backend.warehouse.WarehouseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final SupplierRepository supplierRepository;
    private final InventoryRepository inventoryRepository;
    private final InventoryLogRepository inventoryLogRepository;
    private final NotificationService notificationService;
    private final WarehouseRepository warehouseRepository;
    private final OrderMapper orderMapper;

    public List<OrderResponse> listOrders(OrderStatus status) {
        Long wid = TenantContext.get();
        List<PurchaseOrder> orders = status != null
                ? orderRepository.findByStatusAndWarehouseIdOrderByCreatedAtDesc(status, wid)
                : orderRepository.findByWarehouseIdOrderByCreatedAtDesc(wid);
        return orders.stream().map(orderMapper::toResponse).toList();
    }

    public OrderResponse getOrder(Long id) {
        return orderMapper.toResponse(findById(id));
    }

    @Transactional
    public OrderResponse createOrder(CreateOrderRequest request, String createdBy) {
        Long wid = TenantContext.get();
        Supplier supplier = supplierRepository.findByIdAndWarehouseId(request.supplierId(), wid)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with id: " + request.supplierId()));

        PurchaseOrder order = PurchaseOrder.builder()
                .supplier(supplier)
                .warehouse(warehouseRepository.getReferenceById(wid))
                .status(OrderStatus.PENDING)
                .notes(request.notes())
                .expectedDelivery(request.expectedDelivery())
                .orderedAt(LocalDateTime.now())
                .createdBy(createdBy)
                .build();
        order = orderRepository.save(order);
        order.setOrderNumber(String.format("PO-%d-%04d", LocalDateTime.now().getYear(), order.getId()));

        BigDecimal total = BigDecimal.ZERO;
        for (var itemReq : request.items()) {
            Product product = productRepository.findByIdAndWarehouseId(itemReq.productId(), wid)
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + itemReq.productId()));
            BigDecimal unitPrice = itemReq.unitPrice() != null ? itemReq.unitPrice() : product.getUnitPrice();
            BigDecimal subtotal = unitPrice.multiply(BigDecimal.valueOf(itemReq.quantity()));

            order.getItems().add(OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(itemReq.quantity())
                    .unitPrice(unitPrice)
                    .subtotal(subtotal)
                    .build());
            total = total.add(subtotal);
        }
        order.setTotalAmount(total);
        orderRepository.save(order);

        log.info("Order {} created for supplier {}", order.getOrderNumber(), supplier.getName());
        return orderMapper.toResponse(order);
    }

    @Transactional
    public OrderResponse updateStatus(Long id, UpdateOrderStatusRequest request, String performedBy) {
        PurchaseOrder order = findById(id);
        validateTransition(order.getStatus(), request.status());
        order.setStatus(request.status());

        if (request.status() == OrderStatus.DELIVERED) {
            for (OrderItem item : order.getItems()) {
                inventoryRepository.findByProductId(item.getProduct().getId()).ifPresent(inv -> {
                    int prev = inv.getQuantity();
                    int newQty = prev + item.getQuantity();
                    inv.setQuantity(newQty);
                    inv.recalculateStatus();
                    inventoryRepository.save(inv);
                    inventoryLogRepository.save(InventoryLog.builder()
                            .inventoryItem(inv)
                            .movementType(InventoryMovementType.RESTOCK)
                            .quantityChange(item.getQuantity())
                            .previousQuantity(prev)
                            .newQuantity(newQty)
                            .note("Received from order " + order.getOrderNumber())
                            .createdBy(performedBy)
                            .build());
                });
            }
            log.info("Order {} delivered — inventory updated for {} items",
                    order.getOrderNumber(), order.getItems().size());
        }

        orderRepository.save(order);
        notificationService.create(
                TenantContext.get(),
                NotificationType.ORDER_STATUS,
                "Order %s is now %s.".formatted(order.getOrderNumber(), request.status()),
                "/orders",
                null);
        return orderMapper.toResponse(order);
    }

    private void validateTransition(OrderStatus current, OrderStatus next) {
        boolean valid = switch (current) {
            case PENDING -> next == OrderStatus.PROCESSING || next == OrderStatus.CANCELLED;
            case PROCESSING -> next == OrderStatus.DELIVERED || next == OrderStatus.CANCELLED;
            case DELIVERED, CANCELLED -> false;
        };
        if (!valid) throw new AppException("Cannot transition order from " + current + " to " + next);
    }

    private PurchaseOrder findById(Long id) {
        return orderRepository.findByIdAndWarehouseId(id, TenantContext.get())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
    }
}
