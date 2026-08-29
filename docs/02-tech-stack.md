# Tech Stack

## Frontend

Use:

- Next.js with App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Hook Form
- Zod
- TanStack Query
- Axios or Fetch wrapper
- Recharts for charts
- Lucide React for icons

Avoid:

- JavaScript files when TypeScript is possible
- Inline styles unless truly necessary
- Large unstructured components
- Hardcoded strings everywhere
- Direct API calls inside UI components

## Backend

Use:

- Java 21+
- Spring Boot
- Spring Web
- Spring Security
- Spring Data JPA / Hibernate
- PostgreSQL or MySQL
- Flyway or Liquibase for migrations
- Lombok for reducing boilerplate in DTOs, entities, and configuration classes
- MapStruct or explicit mapper classes
- JUnit 5
- Mockito
- SLF4J logging

Recommended Lombok annotations:

- `@Getter` and `@Setter` for entities and DTOs
- `@NoArgsConstructor` and `@AllArgsConstructor` for DTOs/entities where needed
- `@Builder` for response DTOs and object creation where it improves readability
- `@RequiredArgsConstructor` for constructor-based dependency injection in services/controllers
- `@Slf4j` for logging

Avoid Lombok misuse:

- Do not use `@Data` blindly on JPA entities.
- Do not use `@ToString` on entities with relationships because it can cause recursion.
- Do not use `@EqualsAndHashCode` carelessly on JPA entities.
- Prefer explicit methods when Lombok makes behavior unclear.

Avoid:

- Business logic inside controllers
- Returning entity classes directly from APIs
- Very large service classes
- Magic strings
- Silent catch blocks
- Exposing stack traces to the frontend
