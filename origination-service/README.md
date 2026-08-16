# Loan Origination Service

The Loan Origination Service manages the end-to-end loan origination workflow.

It tracks a loan application's progress through different stages such as application receipt, document verification, credit assessment, underwriting, approval, and rejection.

The service integrates with the Loan Service for:

- Credit assessment
- Loan creation after underwriting approval

---

## Tech Stack

- Java 21
- Spring Boot
- Spring Data JPA
- H2 Database
- REST APIs
- Maven

---

## Service Ports

### Origination Service

```text
http://localhost:8083
```

### Loan Service

```text
http://localhost:8084
```

---

## Architecture

```text
                    Frontend / Client
                           |
                           v
                +----------------------+
                | Origination Service  |
                |      Port 8083       |
                +----------------------+
                           |
             +-------------+-------------+
             |                           |
             v                           v
   Credit Assessment Client        Loan Client
             |                           |
             +-------------+-------------+
                           |
                           v
                  Loan Service :8084
                    /api/credit/assess
                    /api/loans
```

---

## Loan Origination Workflow

```text
APPLICATION_RECEIVED
        |
        v
DOCUMENT_VERIFICATION
        |
        v
CREDIT_ASSESSMENT
        |
        +------------------+
        |                  |
     REJECTED          APPROVED /
        |             CONDITIONAL
        v                  |
    REJECTED               v
                    UNDERWRITING_REVIEW
                         /        \
                        /          \
                   REJECTED       APPROVED
                      |              |
                      v              v
                  REJECTED      CREATE LOAN
                                     |
                                     v
                                  APPROVED
```

---

## Workflow Stages

### 1. Application Received

A new loan application is created and an `APPLICATION_RECEIVED` stage is automatically created with status:

```text
IN_PROGRESS
```

---

### 2. Document Verification

Once the application received stage is completed, the workflow automatically creates:

```text
DOCUMENT_VERIFICATION
```

with status:

```text
IN_PROGRESS
```

---

### 3. Credit Assessment

After document verification, the workflow moves to:

```text
CREDIT_ASSESSMENT
```

The Origination Service sends the applicant's financial information to the Loan Service.

The Loan Service performs the credit assessment using factors such as:

- Monthly income
- Monthly obligations
- Loan amount
- Age
- Years employed
- Credit history
- Savings balance
- Existing loan count
- Default history

The Credit Assessment Service returns:

- Credit score
- Risk level
- Decision
- Recommended amount
- Suggested interest rate

#### Decision Handling

If the decision is:

```text
REJECTED
```

the workflow moves directly to:

```text
REJECTED
```

If the decision is:

```text
APPROVED
```

or:

```text
CONDITIONAL
```

the workflow moves to:

```text
UNDERWRITING_REVIEW
```

---

### 4. Underwriting Review

The underwriting stage allows the application to be approved or rejected.

#### Approval

If underwriting approves the application:

```json
{
  "approved": true,
  "remarks": "Underwriting approved"
}
```

the Origination Service calls the Loan Service to create the loan.

#### Rejection

If underwriting rejects the application:

```json
{
  "approved": false,
  "remarks": "Underwriting rejected the application"
}
```

the application moves to:

```text
REJECTED
```

and no loan is created.

---

### 5. Loan Creation

When underwriting approves an application, the Origination Service calls:

```http
POST http://localhost:8084/api/loans
```

The Loan Service creates the loan and returns:

- Loan account ID
- Loan number
- Customer ID
- Loan amount
- Interest rate
- Tenure
- Disbursed amount
- Outstanding amount
- Loan status

The generated `loanAccountId` is stored in the Origination Application and associated with the `APPROVED` stage.

---

# API Endpoints

## 1. Create Application

```http
POST http://localhost:8083/origination/applications
```

### Request Body

```json
{
  "customerId": 30,
  "loanAmount": 500000,
  "interestRate": 8.5,
  "tenureMonths": 120,
  "monthlyIncome": 60000,
  "monthlyObligations": 15000,
  "age": 30,
  "yearsEmployed": 5,
  "creditHistoryYears": 7,
  "savingsBalance": 200000,
  "existingLoanCount": 1,
  "defaultHistoryCount": 0
}
```

---

## 2. Complete Application or Document Verification Stage

```http
PUT http://localhost:8083/origination/stages/{stageId}/complete
```

This endpoint is used for:

- `APPLICATION_RECEIVED`
- `DOCUMENT_VERIFICATION`

No request body is required.

After completion, the next workflow stage is automatically created.

---

## 3. Trigger Credit Assessment

```http
PUT http://localhost:8083/origination/stages/{stageId}/credit-assessment
```

No request body is required.

The Origination Service retrieves the application's assessment information and calls the Loan Service:

```http
POST http://localhost:8084/api/credit/assess
```

---

## 4. Complete Underwriting

```http
PUT http://localhost:8083/origination/stages/{stageId}/underwriting
```

### Approval Request

```json
{
  "approved": true,
  "remarks": "Underwriting approved"
}
```

### Rejection Request

```json
{
  "approved": false,
  "remarks": "Underwriting rejected the application"
}
```

If approved, the Loan Service is called to create the loan.

If rejected, no loan is created.

---

## 5. Get Application Stages

```http
GET http://localhost:8083/origination/applications/{applicationId}/stages
```

Returns all workflow stages associated with an application.

Example:

```json
[
  {
    "applicationId": 1,
    "completedAt": "2026-08-16T10:30:00",
    "handledBy": null,
    "loanId": null,
    "remarks": null,
    "stageId": 1,
    "stageName": "APPLICATION_RECEIVED",
    "stageStatus": "COMPLETED",
    "startedAt": "2026-08-16T10:29:00"
  },
  {
    "applicationId": 1,
    "completedAt": "2026-08-16T10:31:00",
    "handledBy": null,
    "loanId": null,
    "remarks": null,
    "stageId": 2,
    "stageName": "DOCUMENT_VERIFICATION",
    "stageStatus": "COMPLETED",
    "startedAt": "2026-08-16T10:30:00"
  },
  {
    "applicationId": 1,
    "completedAt": "2026-08-16T10:32:00",
    "handledBy": null,
    "loanId": null,
    "remarks": "Credit assessment: APPROVED, score: 95, risk: LOW",
    "stageId": 3,
    "stageName": "CREDIT_ASSESSMENT",
    "stageStatus": "COMPLETED",
    "startedAt": "2026-08-16T10:31:00"
  },
  {
    "applicationId": 1,
    "completedAt": "2026-08-16T10:33:00",
    "handledBy": null,
    "loanId": null,
    "remarks": "Underwriting approved",
    "stageId": 4,
    "stageName": "UNDERWRITING_REVIEW",
    "stageStatus": "COMPLETED",
    "startedAt": "2026-08-16T10:32:00"
  },
  {
    "applicationId": 1,
    "completedAt": "2026-08-16T10:33:00",
    "handledBy": null,
    "loanId": 2,
    "remarks": "Loan created successfully. Loan Number: LN-1786856628041",
    "stageId": 5,
    "stageName": "APPROVED",
    "stageStatus": "COMPLETED",
    "startedAt": "2026-08-16T10:33:00"
  }
]
```

---

# Service-to-Service Integration

## Credit Assessment Integration

```text
Origination Service :8083
        |
        | POST /api/credit/assess
        v
Loan Service :8084
        |
        v
CreditAssessmentService
        |
        v
CreditAssessmentResponse
        |
        v
Origination Workflow
```

The returned decision determines whether the application proceeds to underwriting or rejection.

---

## Loan Creation Integration

```text
Origination Service :8083
        |
        | POST /api/loans
        v
Loan Service :8084
        |
        v
LoanAccount
        |
        v
LoanResponse
        |
        v
Origination Application
```

The returned `loanAccountId` is stored in the Origination Application and `APPROVED` workflow stage.

---

# Database

The Origination Service uses an H2 database for development and testing.

The main entities are:

## OriginationApplication

Stores:

- Customer information
- Loan details
- Financial information used for credit assessment
- Loan account ID after loan creation

## LoanOriginationStage

Stores the application's workflow history.

Important fields include:

```text
stageId
applicationId
loanId
stageName
stageStatus
startedAt
completedAt
remarks
handledBy
```

---

# Error Handling

The service uses a global exception handler.

## Resource Not Found

```text
HTTP 404 NOT_FOUND
```

Used when an application or workflow stage cannot be found.

## Workflow Conflict

```text
HTTP 409 CONFLICT
```

Used when an invalid workflow transition is attempted.

## Service Integration Failure

```text
HTTP 503 SERVICE_UNAVAILABLE
```

Used when the Credit Assessment or Loan Service cannot be reached.

Example:

```json
{
  "timestamp": "2026-08-16T10:00:00",
  "status": 503,
  "error": "Service Unavailable",
  "message": "Loan Service is unavailable"
}
```

---

# Running the Service

Make sure Java 21 is configured.

Run the application using Maven:

```bash
mvn spring-boot:run
```

The Origination Service starts on:

```text
http://localhost:8083
```

The Loan Service should be running separately on:

```text
http://localhost:8084
```

---

# Testing Workflow

Recommended testing sequence:

```text
1. POST /origination/applications

2. PUT /origination/stages/{stageId}/complete
   Application Received

3. PUT /origination/stages/{stageId}/complete
   Document Verification

4. PUT /origination/stages/{stageId}/credit-assessment
   Credit Assessment

5. PUT /origination/stages/{stageId}/underwriting
   Underwriting

6. GET /origination/applications/{applicationId}/stages
   Verify workflow
```

For a successful application, verify the created loan in the Loan Service:

```http
GET http://localhost:8084/api/loans/{loanAccountId}
```

---

# Test Scenarios

## Successful Loan Application

```text
APPLICATION_RECEIVED
        ↓
DOCUMENT_VERIFICATION
        ↓
CREDIT_ASSESSMENT
        ↓
APPROVED
        ↓
UNDERWRITING_REVIEW
        ↓
APPROVED
        ↓
LOAN CREATED
```

Verified result:

```text
Loan Account ID: 2
Loan Number: LN-1786856628041
Customer ID: 30
Loan Amount: 500000
Interest Rate: 8.50%
Tenure: 120 months
Status: PENDING
```

---

## Credit Assessment Rejection

```text
APPLICATION_RECEIVED
        ↓
DOCUMENT_VERIFICATION
        ↓
CREDIT_ASSESSMENT
        ↓
REJECTED
```

No loan is created.

---

## Underwriting Rejection

```text
APPLICATION_RECEIVED
        ↓
DOCUMENT_VERIFICATION
        ↓
CREDIT_ASSESSMENT
        ↓
UNDERWRITING_REVIEW
        ↓
REJECTED
```

No loan is created.

---

# Project Structure

```text
src/main/java/com/bankingapp/originationservice
│
├── client
│   ├── CreditAssessmentClient
│   └── LoanClient
│
├── controller
│   └── OriginationController
│
├── dto
│   ├── OriginationApplicationRequest
│   ├── CreditAssessmentRequest
│   ├── CreditAssessmentResponse
│   ├── LoanRequest
│   ├── LoanResponse
│   └── UnderwritingRequest
│
├── entity
│   ├── OriginationApplication
│   └── LoanOriginationStage
│
├── enums
│   ├── AssessmentResult
│   ├── StageName
│   └── StageStatus
│
├── exception
│   ├── GlobalExceptionHandler
│   ├── ResourceNotFoundException
│   ├── ServiceIntegrationException
│   └── WorkflowConflictException
│
├── repository
│   ├── OriginationApplicationRepository
│   └── LoanOriginationStageRepository
│
└── service
    └── OriginationService
```

---

# Current Status

The core Loan Origination Workflow is implemented and integrated with the Loan Service.

Completed:

- Application creation
- Application data storage
- Workflow stage management
- Application Received
- Document Verification
- Credit Assessment integration
- Underwriting
- Loan creation integration
- Loan ID propagation
- Approval workflow
- Credit Assessment rejection
- Underwriting rejection
- H2 persistence
- Service integration error handling
- End-to-end workflow testing

The Origination Service has been tested for successful approval, Credit Assessment rejection, and Underwriting rejection scenarios.