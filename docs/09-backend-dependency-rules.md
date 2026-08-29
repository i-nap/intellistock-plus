# Backend Dependency Rules

Add backend dependencies based on project needs.

Recommended dependencies:

```xml
<!-- Spring Boot starters -->
spring-boot-starter-web
spring-boot-starter-security
spring-boot-starter-data-jpa
spring-boot-starter-validation

<!-- Database -->
postgresql or mysql-connector-j

<!-- Migration -->
flyway-core or liquibase-core

<!-- Boilerplate reduction -->
lombok

<!-- Mapping -->
mapstruct

<!-- Testing -->
spring-boot-starter-test
mockito-core
junit-jupiter
```

Use Lombok with constructor injection.

Good:

```java
@Service
@RequiredArgsConstructor
@Slf4j
public class InventoryService {
    private final InventoryRepository inventoryRepository;
}
```

Avoid field injection.

Bad:

```java
@Autowired
private InventoryRepository inventoryRepository;
```
