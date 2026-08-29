# Code Quality Rules

Before finalizing code:

- Run formatter
- Run linter
- Run tests
- Check TypeScript errors
- Check backend build
- Remove unused code
- Remove console logs unless intentional
- Check responsive UI
- Check loading and error states

Frontend commands may include:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

Backend commands may include:

```bash
./mvnw test
./mvnw spring-boot:run
./mvnw package
```

Use the actual project scripts if they differ.
