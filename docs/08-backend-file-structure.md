# Backend File Structure

Use package-by-feature where possible.

```txt
backend/
  src/main/java/com/intellistock/
    IntelliStockApplication.java

    auth/
      AuthController.java
      AuthService.java
      dto/
      mapper/
      security/

    user/
      User.java
      Role.java
      UserRepository.java
      UserService.java
      UserController.java
      dto/
      mapper/

    product/
      Product.java
      ProductRepository.java
      ProductService.java
      ProductController.java
      dto/
      mapper/

    supplier/
      Supplier.java
      SupplierRepository.java
      SupplierService.java
      SupplierController.java
      dto/
      mapper/

    inventory/
      InventoryItem.java
      InventoryLog.java
      InventoryRepository.java
      InventoryLogRepository.java
      InventoryService.java
      InventoryController.java
      dto/
      mapper/

    order/
      PurchaseOrder.java
      OrderItem.java
      OrderRepository.java
      OrderService.java
      OrderController.java
      dto/
      mapper/

    reorder/
      ReorderService.java
      ReorderRule.java
      ReorderRecommendation.java
      ReorderController.java
      dto/

    notification/
      Notification.java
      NotificationRepository.java
      NotificationService.java
      NotificationController.java
      dto/

    report/
      ReportService.java
      ReportController.java
      dto/

    dashboard/
      DashboardService.java
      DashboardController.java
      dto/

    common/
      config/
      constants/
      exception/
      response/
      security/
      util/
```
