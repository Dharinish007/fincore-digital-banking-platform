# Secure Digital Banking Platform

A Spring Boot microservices backend for a digital banking platform. The project is divided into independent services so that account management, loans, fraud detection, security checks, and settlement can be developed and deployed separately.

## 1. Architecture Overview

```text
                         ┌─────────────────────┐
                         │      Frontend       │
                         └──────────┬──────────┘
                                    │ HTTP
                                    ▼
                         ┌─────────────────────┐
                         │     API Gateway      │
                         │      Port 8080       │
                         └──────────┬──────────┘
                                    │ Service name lookup
                                    ▼
                         ┌─────────────────────┐
                         │   Eureka Registry    │
                         │      Port 8761       │
                         └──────────┬──────────┘
                                    │
          ┌─────────────────────────┼─────────────────────────┐
          ▼                         ▼                         ▼
 ┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
 │ Account &       │      │ Loan Management  │      │ Security &       │
 │ Balance Service │      │ Service          │      │ Risk Service     │
 │ Port 8084       │      │ Port 8083        │      │ Port 8081        │
 └─────────────────┘      └────────┬────────┘      └────────┬────────┘
                                   │                         │
                                   ▼                         ▼
                          ┌─────────────────┐      ┌─────────────────┐
                          │ Notification /   │      │ Fraud Detection │
                          │ Settlement       │      │ & Notifications │
                          │ Port 8082        │      │ Port 8082        │
                          └─────────────────┘      └─────────────────┘
```

### Request flow

1. The frontend sends a request to the API Gateway.
2. The Gateway matches the URL path with a service route.
3. Eureka provides the registered service instance.
4. The request is forwarded to the selected microservice.
5. The microservice performs business logic and communicates with other services when required.
6. A response is returned through the Gateway to the frontend.

## 2. Modules and Features

### A. Account and Balance Management
**Application:** `FinCore Digital Banking Management Platform2`  
**Port:** `8084`

Handles core customer banking operations.

Features:
- User registration and login.
- JWT-based authentication.
- Account creation and account lifecycle operations.
- User and account updates/deletion.
- Balance management.
- Transaction statement generation.
- Transaction history retrieval.

Important packages:
- `accountlifecycle` – users and accounts.
- `balancemanagement` – balances.
- `statementgeneration` – statements and transactions.
- `config.security` – JWT and Spring Security configuration.

Database:
- Configured through environment variables (`DB_URL`, `DB_USERNAME`, `DB_PASSWORD`).

---

### B. Loan Management
**Application:** `Milestone2-Loan Management`  
**Service name:** `milestone2-loan-management`  
**Port:** `8083`

Manages the complete loan payment lifecycle.

Features:
- Loan records.
- EMI calculation.
- EMI retrieval.
- Loan disbursement.
- Collection/payment processing.
- Communication with the Notification Service using OpenFeign.

Main packages:
- `EMI` – EMI calculation and APIs.
- `disbursement` – loan disbursement.
- `collection` – loan collections and payments.
- `client` – inter-service notification client.

---

### C. Fraud Detection, Notifications and Settlement
**Application:** `milestone-3`  
**Service name:** `milestone-3`  
**Port:** `8082`

Provides transaction monitoring and post-payment processing.

Features:
- Fraud event creation and fraud detection.
- Notification creation and email delivery.
- Settlement processing.
- Payment allocation against loans.
- Settlement and transaction records.

Main packages:
- `fraudDetection` – fraud events and fraud service.
- `notificationService` – notification APIs, persistence, and email service.
- `settlementEngine` – settlement, loan, transaction, and payment allocation logic.

---

### D. Security, Liveness and Risk Assessment
**Application:** `Secure-Digital-banking-milestone-4`  
**Service name:** `Secure-Digital-banking-milestone-4`  
**Port:** `8081`

Adds security controls for banking operations.

Features:
- Liveness detection using OpenCV and Haar Cascade.
- Face/liveness verification.
- Risk assessment.
- Audit logging.
- Notification service integration.

Main packages:
- `livenessDetection` – image-based liveness verification.
- `riskAssessment` – risk evaluation.
- `auditLogging` – audit records and APIs.
- `client` – Feign client for notifications.

Resource:
- `src/main/resources/haarcascade_frontalface_default.xml`

---

### E. Service Registry
**Application:** `service-registery`  
**Service name:** `service-registery`  
**Port:** `8761`

Uses Netflix Eureka Server for service discovery.

Responsibilities:
- Keeps track of running microservice instances.
- Allows services to register themselves.
- Allows the API Gateway and other services to locate services by name.
- Reduces hard-coded host/port dependencies.

Eureka dashboard:
`http://localhost:8761`

---

### F. API Gateway
**Application:** `api-gateway`  
**Port:** `8080`

The single entry point for client requests.

Configured routes:

| Gateway URL Prefix | Destination Service | Port |
|---|---|---:|
| `/M1/**` | milestone-1 | 8084 |
| `/M3/**` | milestone-3 | 8082 |
| `/M2/**` | milestone2-loan-management | 8083 |
| `/M4/**` | Secure-Digital-banking-milestone-4 | 8081 |

The Gateway uses load-balanced URIs (`lb://...`) and Eureka for discovery. `StripPrefix=1` removes the service prefix before forwarding the request.

Example:
```text
Client:  http://localhost:8080/milestone-3/fraud/...
Gateway forwards to:
         http://M3/fraud/...
```

Note: The FinCore account service is configured with Eureka but is not currently included in the API Gateway route file. Add a route if it should be accessed through port 8080.

## 3. Inter-Service Communication

### Eureka Service Discovery

Every microservice registers with Eureka:

```properties
eureka.client.service-url.defaultZone=http://localhost:8761/eureka/
eureka.client.register-with-eureka=true
eureka.client.fetch-registry=true
```

Services should be started after the registry so they can register successfully.

### OpenFeign

OpenFeign is used where one service needs to call another service.

Current examples:
- Loan Management → Notification Service.
- Milestone 4 → Notification Service.

Typical flow:

```text
Loan event occurs
      ↓
Loan Management Service
      ↓ OpenFeign HTTP call
Notification Service (milestone-3)
      ↓
Email / notification is created and delivered
```

Feign clients use a service name rather than a fixed IP address, allowing Eureka to resolve the destination.

### Authentication

The FinCore service contains JWT authentication and Spring Security configuration. Other services may be called through the Gateway independently unless authentication is added to their security configuration.

For production, authentication should be validated consistently at the Gateway and/or every protected downstream service.

## 4. Technology Stack

- Java
- Spring Boot
- Spring Web / REST APIs
- Spring Data JPA
- Hibernate
- Spring Cloud Gateway (MVC)
- Netflix Eureka Server and Eureka Client
- OpenFeign
- Spring Security
- JWT
- H2 Database (Milestone 2 and Milestone 3 development configuration)
- MySQL/PostgreSQL-compatible external database configuration for FinCore
- JavaMail/Spring Mail
- OpenCV and Haar Cascade
- Maven

## 5. Project Structure

```text
secure-digital-banking-backend - team-b/
│
├── api-gateway/
├── service-registery/
├── FinCore Digital Banking Management Platform2/
├── Milestone2-Loan Management/
├── milestone-3/
└── Secure-Digital-banking-milestone-4/
```

Each application is an independent Maven Spring Boot project with its own:
- `pom.xml`
- `src/main/java`
- `src/main/resources/application.properties`
- `src/test`

## 6. Prerequisites

Install:

1. Java 17 or the Java version specified by the Maven projects.
2. Maven (or use the included Maven Wrapper).
3. Git (optional).
4. An IDE such as IntelliJ IDEA or Eclipse.
5. MySQL/PostgreSQL or another supported database for FinCore.
6. Internet access for Maven dependencies.
7. OpenCV-compatible runtime for liveness detection.

## 7. Configuration

### FinCore environment variables

The FinCore application expects:

```text
PORT=8084
DB_URL=<database-jdbc-url>
DB_USERNAME=<database-username>
DB_PASSWORD=<database-password>
JWT_SECRET=<strong-secret-key>
```

Do not commit real passwords, JWT secrets, or email credentials to Git.

### H2 services

Milestone 2 and Milestone 3 use an in-memory H2 database by default:

```text
Database URL: jdbc:h2:mem:fincore
Username: sa
Password: empty
```

Data is recreated when the application restarts.

H2 console is enabled in these services:
- `http://localhost:8082/h2-console`
- `http://localhost:8083/h2-console`

## 8. How to Run

Start services in this order.

### Step 1: Start Eureka Registry

```bash
cd service-registery
./mvnw spring-boot:run
```

Windows:

```powershell
mvnw.cmd spring-boot:run
```

Verify:
`http://localhost:8761`

### Step 2: Start Backend Microservices

Open a separate terminal for each:

```bash
cd "FinCore Digital Banking Management Platform2"
./mvnw spring-boot:run
```

```bash
cd "Milestone2-Loan Management"
./mvnw spring-boot:run
```

```bash
cd milestone-3
./mvnw spring-boot:run
```

```bash
cd Secure-Digital-banking-milestone-4
./mvnw spring-boot:run
```

### Step 3: Start API Gateway

```bash
cd api-gateway
./mvnw spring-boot:run
```

The Gateway is available at:

```text
http://localhost:8080
```

## 9. Recommended Startup Checklist

Before testing APIs:

- [ ] Eureka is running on port 8761.
- [ ] All required services are registered in Eureka.
- [ ] No two services use the same port.
- [ ] Database environment variables are configured for FinCore.
- [ ] The required JWT secret is configured.
- [ ] Notification service is running before testing Feign-based notifications.
- [ ] API Gateway is running if requests are sent through port 8080.

## 10. Testing the System

You can test APIs using Postman, Swagger (if configured), curl, or the frontend.

Direct service testing:
```text
Account Service:       http://localhost:8084
Security Service:      http://localhost:8081
Milestone 3:           http://localhost:8082
Loan Management:       http://localhost:8083
```

Gateway testing:
```text
http://localhost:8080/M3/...
http://localhost:8080/M2/...
http://localhost:8080/M4/...
http://localhost:8080/M1/...
```

Use the exact controller mappings defined in each module when constructing endpoint URLs.

## 11. Troubleshooting

### 503: Unable to find instance for a service

Possible causes:
- The target service is not running.
- The service name in Eureka does not match the Gateway/Feign client name.
- Eureka is unavailable.
- The service has not registered yet.

Fix:
1. Start Eureka first.
2. Start the target microservice.
3. Check `http://localhost:8761`.
4. Confirm the registered application name exactly matches the `lb://` or Feign service name.

### Bean of type NotificationClient not found

Check:
- `@EnableFeignClients` is enabled in the application.
- The Feign client interface has `@FeignClient(name = "...")`.
- The package containing the client is scanned by Spring.
- The destination service is registered in Eureka.

### Port already in use

Find and stop the process using the port, or change `server.port` in the corresponding application configuration.

### Database connection failure

Check:
- `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD`.
- Database server status.
- JDBC driver dependency.
- Database permissions.


## 12. Summary

This backend follows a microservices architecture where each business capability is isolated into a separate Spring Boot application. Eureka handles discovery, the API Gateway provides a unified entry point, and OpenFeign enables service-to-service communication. Together, the modules cover account management, loans, payments, notifications, fraud detection, settlement, liveness verification, risk assessment, and audit logging.

## Contributor
Janhvi Pandey
