# Security Rules

Required:

- Password hashing with BCrypt
- Role-based access control
- Input validation
- CORS configuration
- CSRF strategy based on authentication method
- Secure JWT handling if JWT is used
- Protected admin routes
- Backend authorization checks, not only frontend hiding

Never:

- Store plain-text passwords
- Put secrets in code
- Trust frontend role checks only
- Return tokens in logs
- Commit `.env` files

Recommended roles:

```txt
ADMIN
MANAGER
WAREHOUSE_STAFF
VIEWER
```

Recommended permissions:

```txt
PRODUCT_READ
PRODUCT_WRITE
INVENTORY_READ
INVENTORY_WRITE
ORDER_READ
ORDER_WRITE
REPORT_READ
USER_MANAGE
```
