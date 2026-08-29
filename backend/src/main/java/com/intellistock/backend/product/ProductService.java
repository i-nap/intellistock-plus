package com.intellistock.backend.product;

import com.intellistock.backend.common.constants.InventoryMovementType;
import com.intellistock.backend.common.constants.InventoryStatus;
import com.intellistock.backend.common.exception.AppException;
import com.intellistock.backend.common.exception.ResourceNotFoundException;
import com.intellistock.backend.common.tenant.TenantContext;
import com.intellistock.backend.inventory.InventoryItem;
import com.intellistock.backend.inventory.InventoryLog;
import com.intellistock.backend.inventory.InventoryLogRepository;
import com.intellistock.backend.reorder.DemandCalculator;
import com.intellistock.backend.inventory.InventoryRepository;
import com.intellistock.backend.product.dto.CreateProductRequest;
import com.intellistock.backend.product.dto.ProductResponse;
import com.intellistock.backend.product.dto.UpdateProductRequest;
import com.intellistock.backend.product.mapper.ProductMapper;
import com.intellistock.backend.warehouse.Warehouse;
import com.intellistock.backend.warehouse.WarehouseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductService {

    private final ProductRepository productRepository;
    private final InventoryRepository inventoryRepository;
    private final InventoryLogRepository inventoryLogRepository;
    private final WarehouseRepository warehouseRepository;
    private final ProductMapper productMapper;

    public List<ProductResponse> listProducts(String search) {
        Long wid = TenantContext.get();
        List<Product> products = StringUtils.hasText(search)
                ? productRepository.findByWarehouseIdAndNameContainingIgnoreCaseOrWarehouseIdAndSkuContainingIgnoreCase(wid, search, wid, search)
                : productRepository.findByWarehouseId(wid);
        return products.stream().map(productMapper::toResponse).toList();
    }

    public ProductResponse getProduct(Long id) {
        return productMapper.toResponse(findById(id));
    }

    @Transactional
    public ProductResponse createProduct(CreateProductRequest request, String createdBy) {
        Long wid = TenantContext.get();
        if (productRepository.existsBySkuAndWarehouseId(request.sku(), wid)) {
            throw new AppException("Product with SKU '" + request.sku() + "' already exists");
        }

        Warehouse warehouse = warehouseRepository.getReferenceById(wid);
        Product product = productMapper.toEntity(request);
        product.setWarehouse(warehouse);
        productRepository.save(product);

        InventoryItem inventoryItem = buildInventoryItem(
                product, request.initialQuantity(), request.reorderThreshold(),
                request.leadTimeInDays(), request.location());
        inventoryRepository.save(inventoryItem);

        inventoryLogRepository.save(InventoryLog.builder()
                .inventoryItem(inventoryItem)
                .movementType(InventoryMovementType.INITIAL)
                .quantityChange(request.initialQuantity())
                .previousQuantity(0)
                .newQuantity(request.initialQuantity())
                .note("Initial stock on product creation")
                .createdBy(createdBy)
                .build());

        log.info("Product created: {} (SKU: {})", product.getName(), product.getSku());
        return productMapper.toResponse(product);
    }

    @Transactional
    public ProductResponse updateProduct(Long id, UpdateProductRequest request) {
        Long wid = TenantContext.get();
        Product product = findById(id);
        if (productRepository.existsBySkuAndIdNotAndWarehouseId(request.sku(), id, wid)) {
            throw new AppException("Product with SKU '" + request.sku() + "' already exists");
        }
        productMapper.updateEntity(product, request);
        productRepository.save(product);
        return productMapper.toResponse(product);
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = findById(id);
        inventoryRepository.findByProductId(id).ifPresent(item -> {
            inventoryLogRepository.deleteByInventoryItemId(item.getId());
            inventoryRepository.delete(item);
        });
        productRepository.delete(product);
        log.info("Product deleted: {} (SKU: {})", product.getName(), product.getSku());
    }

    private Product findById(Long id) {
        return productRepository.findByIdAndWarehouseId(id, TenantContext.get())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }

    private InventoryItem buildInventoryItem(Product product, int quantity, int threshold,
                                            Integer leadTimeInDays, String location) {
        InventoryStatus status;
        if (quantity <= 0) status = InventoryStatus.OUT_OF_STOCK;
        else if (quantity <= threshold) status = InventoryStatus.LOW_STOCK;
        else status = InventoryStatus.IN_STOCK;
        return InventoryItem.builder()
                .product(product)
                .quantity(quantity)
                .reorderThreshold(threshold)
                .leadTimeInDays(leadTimeInDays == null ? DemandCalculator.DEFAULT_LEAD_TIME_DAYS : leadTimeInDays)
                .location(location)
                .status(status)
                .build();
    }
}
