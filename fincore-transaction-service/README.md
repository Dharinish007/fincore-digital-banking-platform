# FinCore Nexus - Transaction Service

Backend microservice for account creation, deposits, withdrawals, transfers, and
transaction history. Built as a **plain synchronous REST service** — no Kafka,
no event streaming — so it's easy to run, test, and demo on its own.

## Tech
- Java 17, Spring Boot 3.3
- Spring Web, Spring Data JPA, Bean Validation
- H2 in-memory database (default) — zero setup required
- Lombok

## Run it in IntelliJ
1. Open the project folder (`File -> Open`) and let Maven download dependencies.
2. Run `TransactionServiceApplication.main()`.
3. Server starts on **http://localhost:8081**.
4. Two sample accounts are seeded automatically on startup:
   - `1234-5678-9012` — John Smith — balance 12847.50
   - `2222-3333-4444` — Priya Nair — balance 5000.00
5. H2 console (optional): http://localhost:8081/h2-console — JDBC URL `jdbc:h2:mem:fincoredb`, user `sa`, blank password.

## Run it from the command line instead
```bash
mvn spring-boot:run
```

## Switching to MySQL later
Open `src/main/resources/application.properties`, comment out the H2 block,
uncomment the MySQL block, and add the `mysql-connector-j` dependency back into `pom.xml` (already stubbed in there, just uncomment it).

## API Reference

### Accounts
| Method | Endpoint | Body |
|---|---|---|
| POST | `/api/v1/accounts` | `{ "customerName": "...", "accountType": "SAVINGS", "openingBalance": 1000 }` |
| GET | `/api/v1/accounts/{accountNumber}` | – |

### Transactions
| Method | Endpoint | Body |
|---|---|---|
| POST | `/api/v1/transactions/deposit` | `{ "accountNumber": "1234-5678-9012", "amount": 500, "remarks": "salary" }` |
| POST | `/api/v1/transactions/withdraw` | `{ "accountNumber": "1234-5678-9012", "amount": 200, "remarks": "ATM" }` |
| POST | `/api/v1/transactions/transfer` | `{ "fromAccountNumber": "1234-5678-9012", "toAccountNumber": "2222-3333-4444", "amount": 100, "remarks": "rent" }` |
| GET | `/api/v1/transactions/history/{accountNumber}?page=0&size=20` | – |

### Sample curl
```bash
curl -X POST http://localhost:8081/api/v1/transactions/deposit \
  -H "Content-Type: application/json" \
  -d '{"accountNumber":"1234-5678-9012","amount":500,"remarks":"salary"}'
```

## Design notes (matches milestone validations)
- **Transaction atomicity** — each operation runs inside a single `@Transactional`
  method; the balance update and the audit `Transaction` row are written together
  and roll back together on any failure.
- **Concurrency safety** — accounts are fetched with a pessimistic write lock
  (`SELECT ... FOR UPDATE`) before any balance change, so two simultaneous
  requests on the same account can't corrupt the balance. Transfers lock both
  accounts in a fixed order to avoid deadlocks.
- **Balance accuracy** — `balance` and `amount` are `BigDecimal`, never
  floating point.
- **Audit trail** — every attempt (including failed withdrawals/transfers due
  to insufficient balance) is written to the immutable `transactions` table
  with a unique reference ID.
- **No Kafka** — intentionally synchronous REST-to-DB flow, so it runs
  standalone without any external broker or extra infrastructure.

## Next steps you may want to add
- JWT/Keycloak security on the endpoints (to match your API Gateway/OAuth2 layer)
- Swap H2 for PostgreSQL/MySQL for the real environment
- Push this behind your Spring Cloud Gateway with rate limiting
