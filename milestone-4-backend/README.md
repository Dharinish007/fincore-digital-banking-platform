# Secure Digital Banking – Milestone 4

A Spring Boot backend for security-focused features of a digital banking application.

## Modules

### 1. Audit Logging

The Audit Logging module records important security and banking events for traceability.

**Stored information:**
- User ID
- Action
- Resource type
- Resource ID
- Description
- IP address
- Timestamp

**Endpoints:**

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auditLogging/logs` | Create an audit log |
| GET | `/api/auditLogging/allLogs` | Get all audit logs |
| GET | `/api/auditLogging/logs/{userId}` | Get logs for a user |
| GET | `/api/auditLogging/TransactionLogs/{transactionId}` | Get logs for a transaction |

---

### 2. Liveness Detection

The Liveness Detection module accepts a video uploaded by the client and processes frames using OpenCV.

**Current approach:**
1. Receive the video as a multipart file.
2. Temporarily save the video.
3. Open the video using OpenCV `VideoCapture`.
4. Process sampled frames.
5. Detect a face using a Haar Cascade classifier.
6. Track the horizontal position of the detected face.
7. Validate head-movement challenges such as `TURN_LEFT` and `TURN_RIGHT`.
8. Store the verification result.
9. Create an audit-log entry.
10. Delete the temporary video.

The uploaded video is not stored permanently by the service.

**Endpoint:**

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/livenessDetection/verify` | Verify liveness from an uploaded video |

**Postman request:**

Use `Body -> form-data`:

| Key | Type | Example |
|---|---|---|
| `userId` | Text | `101` |
| `challenge` | Text | `TURN_LEFT` |
| `video` | File | `liveness.mp4` |

The application also captures the request IP address and records it in the audit log.

> **Note:** The current implementation uses Haar Cascade face detection and movement-based verification. It is a project prototype and not a production-grade biometric liveness system.

---

### 3. Risk Assessment

The Risk Assessment module uses a rule-based scoring system to evaluate transaction risk.

Current factors include:

- Transaction amount
- Difference between the current IP address and recent audit activity
- Liveness verification result

### Risk scoring

| Risk factor | Score |
|---|---:|
| Transaction amount >= ₹100,000 | +20 |
| Transaction amount >= ₹500,000 | +40 |
| Current IP differs from recent activity | +15 |
| Liveness verification failed | +20 |

The score is capped at 100.

### Risk levels

| Score | Risk Level | Decision |
|---:|---|---|
| 0–30 | LOW | ALLOW |
| 31–60 | MEDIUM | REVIEW |
| 61–100 | HIGH | BLOCK |

**Endpoints:**

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/riskAssessment/assess` | Assess transaction risk |
| GET | `/api/riskAssessment/transaction/{transactionId}` | Get assessment for a transaction |
| GET | `/api/riskAssessment/user/{userId}` | Get assessments for a user |
| GET | `/api/riskAssessment/high-risk` | Get high-risk assessments |

**Example request:**

```json
{
  "amount": 100000,
  "userId": 101,
  "transactionId": 1001
}
```

---

## Overall Security Flow

```text
                    Banking Transaction
                            |
                            v
                    +---------------+
                    | Risk Assessment|
                    +---------------+
                      /      |      \
                     /       |       \
                  LOW      MEDIUM     HIGH
                   |          |         |
                 ALLOW      REVIEW     BLOCK

              Liveness Detection
                      |
              +-------+-------+
              |               |
           VERIFIED         FAILED
              |               |
              +-------+-------+
                      |
                      v
                Risk Assessment
                      |
                      v
                 Audit Logging
```

A typical liveness flow is:

```text
Frontend
   |
   | video + userId + challenge
   v
Liveness Controller
   |
   v
Liveness Service
   |
   +--> OpenCV VideoCapture
   |
   +--> Extract/sample frames
   |
   +--> Face detection
   |
   +--> Challenge verification
   |
   +--> Save verification result
   |
   +--> Save audit event
   |
   v
Response
```

## Technology Stack

- **Java 25**
- **Spring Boot 4.1.1**
- **Spring Web MVC**
- **Spring Data JPA**
- **H2 Database**
- **OpenCV 4.9.0**
- **Lombok**
- **Maven**

## Project Structure

```text
src/main/java/com/example/securedigitalbankingmilestone4/
│
├── auditLogging/
│   ├── AuditController.java
│   ├── AuditLog.java
│   ├── AuditRepo.java
│   └── AuditService.java
│
├── livenessDetection/
│   ├── LivenessDetectionController.java
│   ├── LivenessDetectionRepo.java
│   ├── LivenessDetectionService.java
│   └── LivenessVerification.java
│
├── riskAssessment/
│   ├── RiskAssessment.java
│   ├── RiskAssessmentController.java
│   ├── RiskAssessmentRepo.java
│   ├── RiskAssessmentRequest.java
│   └── RiskAssessmentService.java
│
└── SecureDigitalBankingMilestone4Application.java

src/main/resources/
├── application.properties
└── haarcascade_frontalface_default.xml
```

## Prerequisites

Make sure the following are installed:

- JDK 25
- Maven, or use the included Maven Wrapper
- IntelliJ IDEA (recommended)
- Postman for API testing

## Running the Application

### Using Maven Wrapper on Windows

```bash
mvnw.cmd spring-boot:run
```

### Or using Maven

```bash
mvn spring-boot:run
```

### Build the project

```bash
mvnw.cmd clean install
```


## File Upload Configuration

The application currently limits uploaded videos to 5 MB:

```properties
spring.servlet.multipart.max-file-size=5MB
spring.servlet.multipart.max-request-size=5MB
```

For short liveness videos, this can be increased if required, for example:

```properties
spring.servlet.multipart.max-file-size=50MB
spring.servlet.multipart.max-request-size=50MB
```

## OpenCV

The project uses:

```xml
<dependency>
    <groupId>org.openpnp</groupId>
    <artifactId>opencv</artifactId>
    <version>4.9.0-0</version>
</dependency>
```

The face classifier file is located at:

```text
src/main/resources/haarcascade_frontalface_default.xml
```

The application loads the OpenCV native library using:

```java
OpenCV.loadLocally();
```

## Database

H2 is used for development/testing.

JPA entities currently include:

- `AuditLog`
- `LivenessVerification`
- `RiskAssessment`

For a production banking application, these would normally be moved to a production database with appropriate security, encryption, access control, retention, and auditing policies.

## Testing with Postman

### Liveness Detection

```text
POST /api/livenessDetection/verify
```

Use:

```text
Body
 -> form-data

userId     = 101
challenge  = TURN_LEFT
video      = <select video file>
```

### Risk Assessment

```text
POST /api/riskAssessment/assess
```

Use:

```json
{
  "amount": 100000,
  "userId": 101,
  "transactionId": 1001
}
```

### Audit Log

```text
POST /api/auditLogging/logs
```

Example:

```json
{
  "userId": 101,
  "action": "Liveness Verification",
  "resourceType": "Verification",
  "resourceId": "1",
  "description": "Liveness Verification status:VERIFIED Challenge:TURN_LEFT",
  "ipAddress": "127.0.0.1"
}
```


**Milestone 4 currently covers:**

- Audit Logging
- Video-based Liveness Detection prototype
- Rule-based Risk Assessment
- IP-based risk signal
- Integration of liveness events with audit logging

### Contributor
Janhvi Pandey

