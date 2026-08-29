package com.intellistock.backend.order.mapper;

import com.intellistock.backend.order.OrderItem;
import com.intellistock.backend.order.PurchaseOrder;
import com.intellistock.backend.order.dto.OrderItemResponse;
import com.intellistock.backend.order.dto.OrderResponse;
import com.intellistock.backend.product.mapper.ProductMapper;
import com.intellistock.backend.supplier.mapper.SupplierMapper;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {SupplierMapper.class, ProductMapper.class})
public interface OrderMapper {
    OrderResponse toResponse(PurchaseOrder order);
    OrderItemResponse toItemResponse(OrderItem item);
}
