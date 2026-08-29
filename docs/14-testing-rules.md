# Testing Rules

## Frontend Tests

Test:

- Form validation
- Table rendering
- Empty states
- Loading states
- Error states
- Important business utilities

Use:

- Vitest
- React Testing Library

## Backend Tests

Test:

- Service logic
- Controller validation
- Repository queries where needed
- Security restrictions
- Reorder calculations

Use:

- JUnit 5
- Mockito
- Spring Boot Test
- Testcontainers if database integration testing is needed

Required backend test examples:

```txt
InventoryServiceTest
ReorderServiceTest
ProductControllerTest
AuthServiceTest
```
