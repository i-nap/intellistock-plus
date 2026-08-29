package com.intellistock.backend.supplier.mapper;

import com.intellistock.backend.supplier.Supplier;
import com.intellistock.backend.supplier.dto.CreateSupplierRequest;
import com.intellistock.backend.supplier.dto.SupplierResponse;
import com.intellistock.backend.supplier.dto.UpdateSupplierRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface SupplierMapper {

    SupplierResponse toResponse(Supplier supplier);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Supplier toEntity(CreateSupplierRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntity(@MappingTarget Supplier supplier, UpdateSupplierRequest request);
}
