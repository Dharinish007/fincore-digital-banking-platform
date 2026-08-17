# Loan Management System

A Spring Boot based backend for managing core loan lifecycle operations
including **EMI calculation, loan disbursement, and EMI collection**.
The project exposes REST APIs that can be consumed by a frontend
application and tested using Postman.

## Overview

The system is divided into three major functional modules:

-   **EMI Module** -- calculates EMI and manages EMI schedules.
-   **Disbursement Module** -- manages the release of approved loan
    amounts.
-   **Collection Module** -- tracks due amounts, overdue EMIs, and
    borrower payments.

The backend follows a layered architecture using Controllers, Services,
Repositories, Entities, and DTOs.

## Technology Stack

-   Java
-   Spring Boot 4.1.0
-   Spring Data JPA
-   Hibernate
-   H2 Database
-   Maven
-   Lombok
-   Postman
-   JWT Security (if enabled in the final application)

## Architecture

``` text
Frontend / Client
       |
       | HTTP / JSON
       v
+-------------------+
| Controller Layer  |
+---------+---------+
          |
          v
+-------------------+
|  Service Layer    |
+---------+---------+
          |
          v
+-------------------+
| Repository Layer  |
+---------+---------+
          |
          v
+-------------------+
| JPA / Hibernate   |
+---------+---------+
          |
          v
+-------------------+
| H2 Database       |
+-------------------+
```

## Project Structure

``` text
src/main/java/com/example/milestone2loanmanagement
|
+-- EMI/
|   +-- EMIDTOs
|   +-- EMIController.java
|   +-- EMIService.java
|   +-- EMIRepository.java
|   +-- EMI.java
|
+-- loan/
|   +-- Loan.java
|   +-- LoanRepository.java
|
+-- disbursement/
|   +-- DTOs
|   +-- DisbursementController.java
|   +-- DisbursementService.java
|   +-- DisbursementRepository.java
|   +-- Disbursement.java
|
+-- collection/
|   +-- CollectionDTOs
|   +-- CollectionController.java
|   +-- CollectionService.java
|   +-- CollectionRepository.java
|   +-- Collection.java
|
+-- Milestone2LoanManagementApplication.java
|
+-- src/main/resources/
    +-- application.properties
    +-- data.sql
```

Adjust the package names if your actual project structure differs.

## Entity Relationships

``` text
                    Loan
                     |
          +----------+----------+
          |                     |
         1:N                   1:N
          |                     |
          v                     v
         EMI             Disbursement
          |
         1:N
          |
          v
      Collection
```

### Relationships

-   One **Loan** can have many **EMIs**.
-   One **Loan** can have multiple **Disbursements**.
-   One **EMI** can have collection records.
-   A Collection can determine its Loan through
    `Collection -> EMI -> Loan`.

## Main Entities

### Loan

Stores the overall loan information:

-   `id`
-   `principalAmount`
-   `annualInterestRate`
-   `tenureMonths`
-   `emiAmount`
-   `totalInterest`
-   `totalAmount`
-   `startDate`
-   `endDate`

### EMI

Stores each installment in the repayment schedule:

-   `id`
-   `loan`
-   `installmentNumber`
-   `dueDate`
-   `emiAmount`
-   `principalAmount`
-   `interestAmount`
-   `amountPaid`
-   `paymentDate`
-   `status`

### Disbursement

Stores money released against a loan:

-   `id`
-   `loan`
-   `amount`
-   `disbursementDate`
-   `referenceNumber`
-   `beneficiaryAccount`
-   `status`

### Collection

Stores the recovery/payment status of an EMI:

-   `id`
-   `emi`
-   `amountDue`
-   `amountCollected`
-   `dueDate`
-   `collectionDate`
-   `daysOverdue`
-   `status`

## API Documentation

### EMI APIs

  Method   Endpoint                       Description
  -------- ------------------------------ -------------------------
  POST     `/api/emi/calculate`           Calculate EMI
  POST     `/api/emi/schedule/{loanId}`   Generate EMI schedule
  GET      `/api/emi/{emiId}`             Get EMI by ID
  GET      `/api/emi/loan/{loanId}`       Get all EMIs for a loan

#### Calculate EMI

``` http
POST /api/emi/calculate
Content-Type: application/json
```

``` json
{
  "principalAmount": 500000,
  "annualInterestRate": 10.5,
  "tenureMonths": 60
}
```

The EMI calculation uses:

``` text
EMI = P × r × (1+r)^n / ((1+r)^n - 1)
```

where `P` is the principal, `r` is the monthly interest rate, and `n` is
the number of installments.

### Disbursement APIs

  -----------------------------------------------------------------------------------
  Method                  Endpoint                            Description
  ----------------------- ----------------------------------- -----------------------
  POST                    `/api/disbursement`                 Create disbursement

  GET                     `/api/disbursement/{id}`            Get disbursement

  GET                     `/api/disbursement/loan/{loanId}`   Get disbursements for a
                                                              loan

  GET                     `/api/disbursement`                 Get all disbursements

  PATCH                   `/api/disbursement/{id}/status`     Update disbursement
                                                              status
  -----------------------------------------------------------------------------------

#### Create Disbursement

``` http
POST /api/disbursement
Content-Type: application/json
```

``` json
{
  "loanId": 1,
  "amount": 500000,
  "beneficiaryAccount": "1234567890"
}
```

Typical disbursement statuses:

``` text
PENDING
PROCESSING
COMPLETED
FAILED
CANCELLED
```

For multiple disbursements, the backend should ensure that the total
amount disbursed does not exceed the approved loan amount.

### Collection APIs

  Method   Endpoint                          Description
  -------- --------------------------------- ----------------------------
  POST     `/api/collection`                 Create collection
  GET      `/api/collection/{id}`            Get collection
  GET      `/api/collection/loan/{loanId}`   Get collections for a loan
  GET      `/api/collection/overdue`         Get overdue collections
  POST     `/api/collection/{id}/payment`    Record payment

#### Create Collection

``` http
POST /api/collection
Content-Type: application/json
```

``` json
{
  "emiId": 1,
  "amountDue": 10748.33,
  "dueDate": "2026-08-01"
}
```

#### Record Payment

``` http
POST /api/collection/1/payment
Content-Type: application/json
```

``` json
{
  "amount": 5000,
  "paymentMode": "UPI"
}
```

A partial payment changes the collection to `PARTIALLY_PAID`. When the
full amount is collected, the collection becomes `PAID` and the
corresponding EMI is updated.

## DTOs

DTOs are used to separate API request/response data from database
entities.

### EMI DTOs

-   `EmiCalculationRequest`
-   `EmiCalculationResponse`
-   `EmiResponse`

### Disbursement DTOs

-   `DisbursementRequest`
-   `DisbursementResponse`
-   `DisbursementStatusRequest`

### Collection DTOs

-   `CreateCollectionRequest`
-   `CollectionPaymentRequest`
-   `CollectionResponse`

## H2 Database

The project uses H2 for development and API testing.

Example configuration:

``` properties
spring.datasource.url=jdbc:h2:mem:fincore
spring.datasource.driver-class-name=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=create
spring.jpa.defer-datasource-initialization=true

spring.jpa.show-sql=true

spring.h2.console.enabled=true
spring.h2.console.path=/h2-console
```

### H2 Console

After starting the application, open:

``` text
http://localhost:8080/h2-console
```

Use:

``` text
JDBC URL: jdbc:h2:mem:fincore
Username: sa
Password: [leave empty]
```


## API Testing

Postman can be used to test the APIs.

Recommended end-to-end test:

``` text
Get EMI
   |
   v
Get Collection
   |
   v
Make Payment
   |
   v
Check Collection
   |
   v
Check EMI
```

The final step verifies that a collection payment correctly updates the
corresponding EMI.

## Error Handling and Debugging

During development, the following issues were handled:

### Null request values

A `NullPointerException` can occur when a required EMI calculation field
is not populated. Request DTO field names must match the JSON sent by
the client.

### H2 date and timestamp mismatch

`LocalDate` values should use date-only values:

``` text
2026-08-10
```

`LocalDateTime` values should use a timestamp:

``` sql
TIMESTAMP '2026-08-10 14:30:00'
```

### Primary key conflicts

When dummy data manually specifies IDs for
`@GeneratedValue(strategy = GenerationType.IDENTITY)` entities, the
identity sequence may need to be restarted to prevent duplicate primary
key errors.

## Security

JWT-based security can be integrated into the application to protect
REST endpoints.

Typical flow:

``` text
Login
  |
  v
JWT Token
  |
  v
Authorization Header
  |
  v
JWT Filter
  |
  v
Token Validation
  |
  v
Protected APIs
```

If JWT is not enabled in the final version, this section should be
updated to describe it as planned functionality rather than implemented
functionality.

## Running the Project

### Prerequisites

-   Java installed
-   Maven installed
-   IntelliJ IDEA or another Java IDE
-   Postman for API testing

### Run with Maven

``` bash
mvn spring-boot:run
```

Or run:

``` text
Milestone2LoanManagementApplication
```

from the IDE.

The application runs by default on:

``` text
http://localhost:8080
```

## Project Status

The backend currently provides the core implementation for:

-   EMI calculation
-   EMI schedule management
-   Loan disbursement
-   Disbursement status management
-   Collection management
-   Overdue collection retrieval
-   Partial and complete EMI payment processing
-   H2 database integration
-   Dummy data initialization
-   REST API testing

## Contributor

**Janhvi Pandey**

