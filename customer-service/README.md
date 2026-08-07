# Customer Service — FinCore Nexus

Standalone Spring Boot microservice for customer management (profile data, KYC status, risk level).
No Kafka. No Redis. Just REST + JPA — kept deliberately simple to run.

## Stack
- Java 17
- Spring Boot 3.2.5
- Spring Data JPA
- H2 (default, in-memory, zero setup) / PostgreSQL (optional profile)
- Lombok, MapStruct
- springdoc-openapi (Swagger UI)

## Run in IntelliJ
1. **Open** → select the `customer-service` folder → IntelliJ will detect the `pom.xml` and import it as a Maven project automatically.
2. Wait for Maven to finish downloading dependencies (bottom-right progress bar).
3. Make sure **Project SDK is Java 17**: `File → Project Structure → Project → SDK`.
4. Enable annotation processing (needed for Lombok + MapStruct):
   `Settings → Build, Execution, Deployment → Compiler → Annotation Processors → Enable annotation processing`.
5. Install the **Lombok plugin** if you don't have it: `Settings → Plugins → search "Lombok" → Install → Restart`.
6. Open `CustomerServiceApplication.java` → click the green ▶ run icon.

The app starts on **http://localhost:8081** using an in-memory H2 database — nothing else to configure.

## Switching to PostgreSQL
By default the `dev` profile (H2) is active. To use PostgreSQL instead:
1. Create a database: `CREATE DATABASE fincore_customer_db;`
2. Run with the `postgres` profile, e.g. add to VM options / Run Configuration:
   `-Dspring-boot.run.profiles=postgres`
   or set environment variable `SPRING_PROFILES_ACTIVE=postgres`
3. Optionally set `DB_USERNAME` / `DB_PASSWORD` env vars (defaults to `postgres`/`postgres`).

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST   | `/api/v1/customers` | Create a customer |
| GET    | `/api/v1/customers/{id}` | Get customer by internal ID |
| GET    | `/api/v1/customers/number/{customerNumber}` | Get customer by customer number |
| GET    | `/api/v1/customers` | List customers (paginated) |
| GET    | `/api/v1/customers/kyc-status/{status}` | Filter by KYC status (PENDING/VERIFIED/REJECTED) |
| GET    | `/api/v1/customers/search?name=` | Search by first/last name |
| PUT    | `/api/v1/customers/{id}` | Update customer details |
| PATCH  | `/api/v1/customers/{id}/kyc-status` | Update KYC status only |
| DELETE | `/api/v1/customers/{id}` | Delete a customer |

## Tools
- Swagger UI: http://localhost:8081/swagger-ui.html
- H2 Console (dev profile only): http://localhost:8081/h2-console
  - JDBC URL: `jdbc:h2:mem:customerdb`
  - Username: `sa`, Password: *(blank)*
- Health check: http://localhost:8081/actuator/health

## Sample request

```bash
curl -X POST http://localhost:8081/api/v1/customers \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Smith",
    "email": "john.smith@example.com",
    "phoneNumber": "+919876543210",
    "dateOfBirth": "1990-05-14",
    "address": "12 MG Road",
    "city": "Coimbatore",
    "state": "Tamil Nadu",
    "postalCode": "641001",
    "country": "India"
  }'
```

## Notes
- Kafka and Redis are intentionally excluded from this service, per scope.
- `customerNumber` (e.g. `CUST-A1B2C3D4`) is auto-generated on creation.
- This service is designed to sit behind the API Gateway in the full FinCore Nexus architecture, but runs completely standalone for local development.
