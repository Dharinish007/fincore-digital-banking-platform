# FinCore Digital Banking Platform — Integration Guide (Team A + Team D)

> Branch: `integration/team-a-team-d`  
> Status: **COMPLETE** — All 18 services wired, tested, and ready to run.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                Angular Frontend (Port 4200)                 │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP (JWT in Authorization header)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              API Gateway (Port 8080)                        │
│  Routes ALL requests — Team A and Team D                    │
└──────┬───────────────────────────────────┬──────────────────┘
       │                                   │
  TEAM A (Core Banking)           TEAM D (Supporting Services)
       │                                   │
  ┌────┴─────────────┐           ┌─────────┴──────────────┐
  │ Customer   8081  │           │ Risk Scoring   8091     │
  │ Account    8082  │           │ Compliance     8092     │
  │ Transaction 8083 │           │ Notification   8093     │
  │ Dashboard  8084  │           │ Disbursement   8094     │
  │ Loan       8085  │           │ Settlement     8095     │
  │ Beneficiary 8086 │           │ Audit Trail    8096     │
  │ Payment    8087  │           └────────────────────────┘
  │ IMPS/NEFT  8088  │
  │ KYC        8089  │
  │ FaceMatch  8090  │
  └──────────────────┘
```

---

## Port Map

| # | Service | Team | Port |
|---|---------|------|------|
| 1 | API Gateway | A | 8080 |
| 2 | Customer Service | A | 8081 |
| 3 | Account Service | A | 8082 |
| 4 | Transaction Service | A | 8083 |
| 5 | Dashboard Service | A | 8084 |
| 6 | Loan Service | A | 8085 |
| 7 | Beneficiary Service | A | 8086 |
| 8 | Payment Service | A | 8087 |
| 9 | IMPS/NEFT/UPI Service | A | 8088 |
| 10 | KYC Service | A | 8089 |
| 11 | Face Match Service | A | 8090 |
| 12 | Angular Frontend | A | 4200 |
| 13 | Risk Scoring Service | D | 8091 |
| 14 | Compliance Service | D | 8092 |
| 15 | Notification Service | D | 8093 |
| 16 | Disbursement Saga | D | 8094 |
| 17 | Settlement Service | D | 8095 |
| 18 | Audit Trail Service | D | 8096 |

---

## How to Start Everything

### Option 1 — Python (recommended, with live status monitor)
```
python run_all.py
```
- Opens 18 separate terminal windows automatically.
- Supervisor terminal shows live ONLINE/STARTING status for all ports.
- Press `Ctrl+C` in the supervisor terminal to stop all services.

### Option 2 — PowerShell
```
.\run_all.ps1
```

### Option 3 — Manual (individual services)
```
# Team A
cd backend/api-gateway      && mvn spring-boot:run   # 8080
cd backend/customer-service && mvn spring-boot:run   # 8081
... (see run_all.py for full list)

# Team D
cd risk-scoring-service               && mvn spring-boot:run   # 8091
cd complianceservice                  && mvn spring-boot:run   # 8092
cd notification-service               && mvn spring-boot:run   # 8093
cd disbursement-saga                  && mvn spring-boot:run   # 8094
cd settlement-confirmation-service    && mvn spring-boot:run   # 8095
cd audittrail                         && mvn spring-boot:run   # 8096
```

### Stop Everything
```
python stop_all.py
```

---

## Integration Points

### 1. JWT Authentication (shared secret)
All services (Team A and Team D) use the same HMAC-SHA512 secret:
```
FinCoreDigitalBankingPlatformSecureJwtSecretKey2026WithSufficientBitsForHmacSha256
```
Flow: `Login → Team A Auth → JWT issued → Angular stores JWT → Angular calls Gateway → Gateway routes → Team A / Team D validates same JWT`

### 2. KYC Integration (Team A KYC → Team D Compliance & Saga)
- **Endpoint**: `GET /api/v1/kyc/status/{kycId}` (Team A KYC Service, port 8089)
- **Response fields**: `kycId`, `status`, `governmentIdNumber`, `pepDeclaration`, `occupationStatus`, `annualIncomeRange`
- **Used by**: Compliance Service (KycServiceClient) + Disbursement Saga (KycServiceClient)
- Both clients have graceful fallback (returns `APPROVED` if KYC service unreachable)

### 3. Account Debit/Credit (Team A Account Service → Disbursement Saga)
- **Endpoints**: 
  - `GET /api/v1/accounts/number/{accountNumber}` — get account
  - `POST /api/v1/accounts/{accountNumber}/debit?amount={amount}` — debit
  - `POST /api/v1/accounts/{accountNumber}/credit?amount={amount}` — credit
- **Used by**: Disbursement Saga CoreBankingClient
- Falls back to in-memory cache if Account Service is unreachable

### 4. Disbursement Saga → All Team D Services
The full orchestration flow when a disbursement is requested:
```
POST /api/v1/disbursement-sagas/run
  1. KYC check        → GET http://localhost:8080/api/v1/kyc/status/{kycId}
  2. Compliance check → POST http://localhost:8092/api/v1/compliance/check
  3. Debit source     → POST http://localhost:8082/api/v1/accounts/{n}/debit
  4. Credit target    → POST http://localhost:8082/api/v1/accounts/{n}/credit
  5. Audit log        → POST http://localhost:8096/api/audit-logs
  6. Notification     → POST http://localhost:8093/api/notifications
```
On failure, compensation automatically refunds the debit.

### 5. API Gateway Routes (Port 8080)
All Team D routes are accessible through the gateway:

| Gateway Path | Forwards to |
|---|---|
| `/api/v1/risk/**` | Risk Service :8091 |
| `/api/risks/**` | Risk Service :8091 |
| `/api/v1/compliance/**` | Compliance Service :8092 |
| `/api/compliance/**` | Compliance Service :8092 |
| `/api/v1/notifications/**` | Notification Service :8093 |
| `/api/notifications/**` | Notification Service :8093 |
| `/api/v1/disbursement-sagas/**` | Disbursement Saga :8094 |
| `/api/disbursements/**` | Disbursement Saga :8094 |
| `/api/v1/settlements/**` | Settlement Service :8095 |
| `/api/settlements/**` | Settlement Service :8095 |
| `/api/v1/audit/**` | Audit Trail :8096 |
| `/api/audit-logs/**` | Audit Trail :8096 |

---

## Key Design Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| Service communication | REST (RestTemplate) | Simple, works without discovery |
| Fallback strategy | Graceful degradation | Team D services work standalone |
| Data ownership | Team A is source of truth | No duplicate customer/account data |
| Database | H2 in-memory | Zero setup, works offline |
| Auth | Shared JWT secret | No extra infrastructure |
| Service discovery | None — fixed localhost ports | Keeps it simple, easy to debug |

---

## H2 Consoles (for debugging)

Each service exposes an H2 console at `/h2-console`. Use these to inspect data:

| Service | H2 Console URL |
|---------|----------------|
| Risk | http://localhost:8091/h2-console |
| Compliance | http://localhost:8092/h2-console |
| Notification | http://localhost:8093/h2-console |
| Disbursement | http://localhost:8094/h2-console |
| Settlement | http://localhost:8095/h2-console |
| Audit | http://localhost:8096/h2-console |

JDBC URL: `jdbc:h2:mem:<db-name>` (see each service's application.properties)

---

## Quick Smoke Test

Once all services are up, run these to verify integration:

```bash
# 1. Health check
curl http://localhost:8080/actuator/health

# 2. Risk assessment via gateway
curl -X POST http://localhost:8080/api/v1/risk/assessments \
  -H "Content-Type: application/json" \
  -d '{"customerId":1,"customerName":"Test User","accountNumber":"4827298246","transactionId":"TXN001","transactionAmount":5000}'

# 3. Compliance check via gateway
curl -X POST http://localhost:8080/api/v1/compliance/check \
  -H "Content-Type: application/json" \
  -d '{"kycId":1,"amount":5000,"performedBy":"admin"}'

# 4. Disbursement saga (full end-to-end flow)
curl -X POST http://localhost:8080/api/v1/disbursement-sagas/run \
  -H "Content-Type: application/json" \
  -d '{"kycId":1,"sourceAccount":"4827298246","targetAccount":"6155723272","amount":100,"performedBy":"admin"}'

# 5. Verify audit trail was populated
curl http://localhost:8080/api/v1/audit

# 6. Check notifications were sent
curl http://localhost:8080/api/v1/notifications
```
