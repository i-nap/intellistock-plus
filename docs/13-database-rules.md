# Database Rules

Use migrations for schema changes.

Recommended tables/entities:

- users
- roles
- user_roles
- products
- suppliers
- inventory_items
- inventory_logs
- purchase_orders
- order_items
- notifications

Add indexes for frequently queried fields:

- product name
- SKU
- supplier ID
- order status
- created date
- inventory quantity
- notification read status

Use audit fields:

```txt
createdAt
updatedAt
createdBy
updatedBy
```
