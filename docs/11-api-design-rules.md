# API Design Rules

Use RESTful APIs.

Base paths:

```txt
/api/auth
/api/users
/api/products
/api/suppliers
/api/inventory
/api/orders
/api/reorder
/api/notifications
/api/reports
/api/dashboard
```

Use consistent response shape:

```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {}
}
```

For paginated responses:

```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "size": 10,
    "totalItems": 100,
    "totalPages": 10
  }
}
```

Use proper HTTP status codes:

- `200 OK`
- `201 Created`
- `204 No Content`
- `400 Bad Request`
- `401 Unauthorized`
- `403 Forbidden`
- `404 Not Found`
- `409 Conflict`
- `500 Internal Server Error`
