package com.intellistock.backend.inventory.mapper;

import com.intellistock.backend.inventory.InventoryItem;
import com.intellistock.backend.inventory.dto.InventoryItemResponse;
import com.intellistock.backend.product.mapper.ProductMapper;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {ProductMapper.class})
public interface InventoryMapper {
    InventoryItemResponse toResponse(InventoryItem inventoryItem);
}
