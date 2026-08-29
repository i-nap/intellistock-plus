# Backend Coding Rules

## Controller Rules

Controllers should only handle HTTP concerns.

Allowed in controllers:

- Request mapping
- Request validation
- Calling services
- Returning DTO responses

Not allowed in controllers:

- Business calculations
- Database query logic
- Security decisions beyond annotations
- Large conditional workflows

Bad:

```java
@PostMapping
public ResponseEntity<?> createOrder(@RequestBody OrderRequest request) {
    // 100 lines of business logic here
}
```

Good:

```java
@PostMapping
public ResponseEntity<OrderResponse> createOrder(@Valid @RequestBody OrderRequest request) {
    return ResponseEntity.status(HttpStatus.CREATED).body(orderService.createOrder(request));
}
```

## Service Rules

Services contain business logic.

Keep services focused. If a service gets too large, split it.

Examples:

```txt
InventoryService
StockMovementService
ReorderService
ReportGenerationService
NotificationService
```

## DTO Rules

Never expose JPA entities directly from controllers.

Use:

- Request DTOs
- Response DTOs
- Mapper classes

Example:

```txt
CreateProductRequest
UpdateProductRequest
ProductResponse
ProductMapper
```

## Entity Rules

Entities should represent database state only.

Avoid:

- API response logic in entities
- Large helper methods in entities
- Business workflows in entities

## Repository Rules

Repositories should only contain database access.

Use clear method names:

```java
List<Product> findByNameContainingIgnoreCase(String keyword);
List<InventoryItem> findByQuantityLessThanEqual(Integer threshold);
```

For complex queries, use `@Query` or specifications carefully.

## Constants Rules

Do not use magic strings.

Use constants/enums for:

- Roles
- Permissions
- Order status
- Inventory movement type
- Notification type
- Error codes
- Security claims
- API paths if repeated

Example:

```java
public enum InventoryStatus {
    IN_STOCK,
    LOW_STOCK,
    OUT_OF_STOCK
}
```

## Exception Handling

Use a global exception handler.

Required:

```txt
common/exception/GlobalExceptionHandler.java
common/exception/ResourceNotFoundException.java
common/exception/BadRequestException.java
common/response/ErrorResponse.java
```

Do not return raw exception messages to the frontend.

## Logging Rules

Use SLF4J.

Good:

```java
private static final Logger log = LoggerFactory.getLogger(InventoryService.class);
```

Log useful events:

- Login failures
- Stock updates
- Order creation
- Auto-reorder trigger
- Report generation failure

Do not log:

- Passwords
- Tokens
- OTP values
- Sensitive user data
