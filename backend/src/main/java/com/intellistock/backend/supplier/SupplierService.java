package com.intellistock.backend.supplier;

import com.intellistock.backend.common.exception.AppException;
import com.intellistock.backend.common.exception.ResourceNotFoundException;
import com.intellistock.backend.common.tenant.TenantContext;
import com.intellistock.backend.supplier.dto.CreateSupplierRequest;
import com.intellistock.backend.supplier.dto.SupplierResponse;
import com.intellistock.backend.supplier.dto.UpdateSupplierRequest;
import com.intellistock.backend.supplier.mapper.SupplierMapper;
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
public class SupplierService {

    private final SupplierRepository supplierRepository;
    private final WarehouseRepository warehouseRepository;
    private final SupplierMapper supplierMapper;

    public List<SupplierResponse> listSuppliers(String search) {
        Long wid = TenantContext.get();
        List<Supplier> suppliers = StringUtils.hasText(search)
                ? supplierRepository.findByWarehouseIdAndNameContainingIgnoreCaseOrWarehouseIdAndEmailContainingIgnoreCase(wid, search, wid, search)
                : supplierRepository.findByWarehouseId(wid);
        return suppliers.stream().map(supplierMapper::toResponse).toList();
    }

    public SupplierResponse getSupplier(Long id) {
        return supplierMapper.toResponse(findById(id));
    }

    @Transactional
    public SupplierResponse createSupplier(CreateSupplierRequest request) {
        Long wid = TenantContext.get();
        if (supplierRepository.existsByEmailAndWarehouseId(request.email(), wid)) {
            throw new AppException("Supplier with email '" + request.email() + "' already exists");
        }
        Supplier supplier = supplierMapper.toEntity(request);
        supplier.setWarehouse(warehouseRepository.getReferenceById(wid));
        supplierRepository.save(supplier);
        log.info("Supplier created: {} ({})", supplier.getName(), supplier.getEmail());
        return supplierMapper.toResponse(supplier);
    }

    @Transactional
    public SupplierResponse updateSupplier(Long id, UpdateSupplierRequest request) {
        Long wid = TenantContext.get();
        Supplier supplier = findById(id);
        if (supplierRepository.existsByEmailAndIdNotAndWarehouseId(request.email(), id, wid)) {
            throw new AppException("Supplier with email '" + request.email() + "' already exists");
        }
        supplierMapper.updateEntity(supplier, request);
        supplierRepository.save(supplier);
        return supplierMapper.toResponse(supplier);
    }

    @Transactional
    public void deleteSupplier(Long id) {
        Supplier supplier = findById(id);
        supplierRepository.delete(supplier);
        log.info("Supplier deleted: {} ({})", supplier.getName(), supplier.getEmail());
    }

    private Supplier findById(Long id) {
        return supplierRepository.findByIdAndWarehouseId(id, TenantContext.get())
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with id: " + id));
    }
}
