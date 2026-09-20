# Team D Services Integration Guide

## 1. Overview & Selected Services

Team D acts as a specialized supporting layer providing governance, risk, compliance, notification, settlement, audit trail, and saga orchestration for the FinCore Digital Banking Platform. Team A maintains the core banking domain (Customers, Accounts, Transactions, Loans, KYC Profiles).

The following 6 dedicated Spring Boot microservices have been selected, standardized, and verified:

| Service Name | Domain | Port | Base URL | Standard API Path | Status |
|---|---|---|---|---|---|
| **Risk Scoring Service** | Risk assessment & scoring | `8091` | `http://localhost:8091` | `/api/v1/risk` | ✅ Verified |
| **Compliance Service** | Sanctions screening & AML checks | `8092` | `http://localhost:8092` | `/api/v1/compliance` | ✅ Verified |
| **Notification Service** | Multi-channel alert delivery | `8093` | `http://localhost:8093` | `/api/v1/notifications` | ✅ Verified |
| **Disbursement Saga** | Multi-step loan disbursement saga | `8094` | `http://localhost:8094` | `/api/v1/disbursement-sagas` | ✅ Verified |
| **Settlement Confirmation** | Batch settlement management & confirmation | `8095` | `http://localhost:8095` | `/api/v1/settlements` | ✅ Verified |
| **Audit Trail Service** | Cryptographic SHA-256 audit logging | `8096` | `http://localhost:8096` | `/api/v1/audit` | ✅ Verified |

---

## 2. Service Specifications

### 2.1. Risk Scoring Service (`risk-scoring-service`)
- **Purpose**: Evaluates credit, debt-to-income, transaction velocity, and risk parameters to generate quantitative risk scores and risk level classifications (LOW, MEDIUM, HIGH) with historical tracking.
- **Port**: `8091`
- **Base URL**: `http://localhost:8091`
- **Database**: H2 in-memory by default (`risk_scoring_db`), supports MySQL via environment variables.
- **Important Tables**:
  - `risk_assessments`: Assessment id, customerId, customerName, accountNumber, transactionId, transactionAmount, riskScore, riskLevel, riskStatus.
  - `risk_factors`: Assessment risk factors, descriptions.
  - `risk_assessment_history`: Reassessment and audit history.
- **Important Endpoints**:
  - `POST /api/v1/risk`: Create a new risk assessment.
  - `GET /api/v1/risk`: Retrieve all risk assessments.
  - `GET /api/v1/risk/{id}`: Retrieve risk assessment by ID.
  - `GET /api/v1/risk/{id}/history`: Retrieve history for a risk record.
  - `GET /api/v1/risk/statistics`: Retrieve aggregate risk analytics.
  - `GET /api/v1/risk/search?search=...&riskLevel=...`: Filter and search assessments.
  - `POST /api/v1/risk/{id}/reassess`: Recalculate risk score.
- **Expected Team A Data Needed**:
  - `customerId`: Customer identifier.
  - `accountNumber`: Associated account number.
  - `transactionId`: Reference transaction.
  - `transactionAmount`: Amount being assessed.

---

### 2.2. Compliance Service (`complianceservice`)
- **Purpose**: Evaluates transactions against watchlists, PEP (Politically Exposed Persons) status, sanctions registers, and threshold limits to return compliance verdicts (APPROVED, FLAGGED, REJECTED).
- **Port**: `8092`
- **Base URL**: `http://localhost:8092`
- **Database**: H2 in-memory by default (`compliance_db`), supports MySQL via environment variables.
- **Important Tables**:
  - `compliance_checks`: id, kycId, amount, verdict, reasons, performedBy, checkedAt.
- **Important Endpoints**:
  - `POST /api/v1/compliance/check`: Perform AML / sanctions screening for a transaction or customer.
  - `GET /api/v1/compliance`: Retrieve all compliance evaluation records.
  - `GET /api/v1/compliance/{id}`: Retrieve a specific compliance record by ID.
- **Expected Team A Data Needed**:
  - `kycId`: Team A KYC profile identifier.
  - `amount`: Transaction amount.
  - `performedBy`: Officer or user initiating the transaction.

---

### 2.3. Notification Service (`notification-service`)
- **Purpose**: Centralized notification delivery recording alerts for events (KYC status updates, loan disbursements, account holds, general notices).
- **Port**: `8093`
- **Base URL**: `http://localhost:8093`
- **Database**: H2 in-memory by default (`notification_db`), supports MySQL via environment variables.
- **Important Tables**:
  - `notifications`: id, recipient, type, message, status (SENT, READ), createdAt.
- **Important Endpoints**:
  - `POST /api/v1/notifications`: Send/record an alert notification.
  - `GET /api/v1/notifications`: List all notifications.
  - `GET /api/v1/notifications/recipient/{recipient}`: Get notifications for a recipient.
  - `GET /api/v1/notifications/recipient/{recipient}/unread`: List unread notifications.
  - `GET /api/v1/notifications/recipient/{recipient}/unread-count`: Get count of unread notifications.
  - `PUT /api/v1/notifications/{id}/read`: Mark notification as read.
  - `DELETE /api/v1/notifications/{id}`: Delete notification.
- **Expected Team A Data Needed**:
  - `recipient`: User ID or Customer ID.
  - `type`: Event category (e.g. `KYC_APPROVED`, `DISBURSEMENT_SUCCESS`).

---

### 2.4. Disbursement Saga Orchestrator (`disbursement-saga`)
- **Purpose**: Executes the multi-step saga pattern for loan disbursements with automated compensating rollbacks upon failure:
  1. KYC Verification check (queries KYC service)
  2. Compliance & AML check (queries Compliance service on `8092`)
  3. Source Account Debit (queries Core Banking account service)
  4. Target Account Credit (queries Core Banking account service)
  5. Cryptographic Audit Logging (queries Audit service on `8096`)
  6. Failure Notification (queries Notification service on `8093`)
- **Port**: `8094`
- **Base URL**: `http://localhost:8094`
- **Database**: H2 in-memory by default (`disbursement_saga_db`), supports MySQL via environment variables.
- **Important Tables**:
  - `disbursement_saga`: id, sagaId, kycId, sourceAccount, targetAccount, amount, status (STARTED, IN_PROGRESS, COMPLETED, COMPENSATING, FAILED), currentStep, failureReason, createdAt, updatedAt.
- **Important Endpoints**:
  - `POST /api/v1/disbursement-sagas`: Initiate a disbursement saga transaction.
  - `GET /api/v1/disbursement-sagas`: Retrieve all saga records.
  - `GET /api/v1/disbursement-sagas/{sagaId}`: Inspect state and step progression of a specific saga.
- **Expected Team A Data Needed**:
  - `kycId`: KYC record reference.
  - `sourceAccount`: Source account number to debit.
  - `targetAccount`: Beneficiary/borrower account to credit.
  - `amount`: Loan disbursement amount.

---

### 2.5. Settlement Confirmation Service (`settlement-confirmation-service`)
- **Purpose**: Manages end-of-day or interbank clearing settlements, status tracking (PENDING, CONFIRMED), manager approvals, and reconciliation statistics.
- **Port**: `8095`
- **Base URL**: `http://localhost:8095`
- **Database**: H2 in-memory by default (`settlement_confirmation_db`), supports MySQL via environment variables.
- **Important Tables**:
  - `settlements`: id, settlementId, transactionReference, customerName, accountNumber, settlementAmount, settlementDate, transactionCount, status, managerId, confirmedAt.
- **Important Endpoints**:
  - `GET /api/v1/settlements`: List all settlements.
  - `POST /api/v1/settlements`: Register a new settlement record.
  - `GET /api/v1/settlements/{id}`: Get settlement details by ID.
  - `PUT /api/v1/settlements/{id}/confirm?managerId=...`: Confirm/authorize a settlement.
  - `GET /api/v1/settlements/statistics`: Retrieve aggregate settlement volumes and totals.
  - `GET /api/v1/settlements/status/{status}`: Filter by status (PENDING / CONFIRMED).
  - `GET /api/v1/settlements/search?value=...`: Search settlements by reference or customer name.
- **Expected Team A Data Needed**:
  - `transactionReference`: Core banking transaction reference.
  - `accountNumber`: Target clearing/settlement account.
  - `settlementAmount`: Gross or net clearing value.

---

### 2.6. Audit Trail Service (`audittrail`)
- **Purpose**: Immutable cryptographic audit logging. Implements SHA-256 blockchain-style cryptographic chaining where each log entry's hash is computed from its meaningful audit payload concatenated with the `previousHash` of the preceding record. Offers automated cryptographic tamper detection.
- **Port**: `8096`
- **Base URL**: `http://localhost:8096`
- **Database**: H2 in-memory by default (`fincore_audit`), supports MySQL via environment variables.
- **Important Tables**:
  - `audit_logs`: id, entityName, entityId, action, performedBy, status, description, timestamp, previousHash (64-char hex), currentHash (64-char hex).
- **Important Endpoints**:
  - `POST /api/v1/audit`: Create and cryptographically hash an audit event.
  - `GET /api/v1/audit/verify`: Verify the full cryptographic integrity chain and report tamper status.
  - `GET /api/v1/audit`: List all audit records.
  - `GET /api/v1/audit/{id}`: Get audit record by ID.
  - `GET /api/v1/audit/entity/{entityName}/{entityId}`: Query audit timeline for a specific entity.
  - `GET /api/v1/audit/user/{performedBy}`: Query all operations performed by a user.
  - `GET /api/v1/audit/action/{action}`: Filter audit records by action type.
- **Expected Team A Data Needed**:
  - `entityName`: Core banking domain (e.g. `CUSTOMER`, `ACCOUNT`, `LOAN`, `TRANSACTION`).
  - `entityId`: Identifier in the core banking system.
  - `action`: Operation name (e.g. `CREATE_ACCOUNT`, `TRANSFER`, `APPROVE_LOAN`).
  - `performedBy`: User identity or system service.

---

## 3. Database Strategy

1. **Zero-Setup Execution (Default)**:
   All 6 services are pre-configured with embedded H2 in-memory databases with MySQL compatibility mode (`MODE=MySQL`) and automatic DDL generation (`spring.jpa.hibernate.ddl-auto=update`).
   Any developer can run any service immediately without starting or configuring an external MySQL server.
   H2 web consoles are available at `http://localhost:<port>/h2-console`.

2. **Connecting to MySQL**:
   To use MySQL instead of H2, supply standard environment variables when starting the service:
   ```bash
   export SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/<database_name>
   export SPRING_DATASOURCE_DRIVER=com.mysql.cj.jdbc.Driver
   export SPRING_DATASOURCE_USERNAME=root
   export SPRING_DATASOURCE_PASSWORD=your_password
   ```

---

## 4. How to Build and Run the Services

### Build All Services Simultaneously
From repository root:
```bash
mvn clean test
```

### Run All Services Individually
Open separate terminals and run:

```bash
# 1. Risk Scoring Service (Port 8091)
cd risk-scoring-service
mvn spring-boot:run

# 2. Compliance Service (Port 8092)
cd complianceservice
mvn spring-boot:run

# 3. Notification Service (Port 8093)
cd notification-service
mvn spring-boot:run

# 4. Disbursement Saga (Port 8094)
cd disbursement-saga
mvn spring-boot:run

# 5. Settlement Confirmation (Port 8095)
cd settlement-confirmation-service
mvn spring-boot:run

# 6. Audit Trail Service (Port 8096)
cd audittrail
mvn spring-boot:run
```

---

## 5. Next Steps: Connecting Team D with Team A

When connecting Team D to Team A in the next milestone:

1. **KYC Profile Integration**:
   - `complianceservice` and `disbursement-saga` will point `services.kyc.base-url` to Team A's KYC service (or API Gateway).
   - Team D microservices will resolve real KYC approval status and customer occupation/PEP declarations directly from Team A.

2. **Core Banking Account / Transaction Integration**:
   - `disbursement-saga` will switch `CoreBankingClient` from its localized mock to Team A's `account-service` and `transaction-service` endpoints to execute debits and credits on actual customer accounts.

3. **Unified Audit Interceptor**:
   - Team A microservices (`loan-service`, `customer-service`, `payment-service`) can emit audit records via REST to `http://localhost:8096/api/v1/audit`.

4. **Security & Authentication Alignment**:
   - Team D services currently allow open REST communication (`SecurityConfig` with `permitAll()`) for clean inter-service communication. When Team A provides the JWT public key or secret, a common JWT authentication filter can be enabled across the Team D services to extract role-based claims (`ADMIN`, `SUPERVISOR`, `TELLER`, `AUDITOR`, `CUSTOMER`).

5. **Legacy Reference Backend Isolation**:
   - The fake Node.js `api-server` (`api-server/routes.js` and `api-server/db.js`) is decoupled and isolated. It must not be used for backend processing.
