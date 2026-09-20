# Beneficiary Management Service

The Beneficiary Management Service manages beneficiaries associated with customers.

The service provides independent APIs for creating, retrieving, updating, and deleting beneficiary information.

---

## Tech Stack

- Java 21
- Spring Boot
- Spring Data JPA
- H2 Database
- REST APIs
- Maven

---

## Service Port

```text
http://localhost:8085
```

---

## Features

- Create a beneficiary
- Get beneficiary by ID
- Get all beneficiaries for a customer
- Update beneficiary details
- Delete a beneficiary
- Input validation
- Exception handling
- H2 database persistence

---

## API Endpoints

### 1. Create Beneficiary

```http
POST /api/beneficiaries
```

### Request Body

```json
{
  "customerId": 30,
  "beneficiaryName": "Jane Doe",
  "accountNumber": "123456789012",
  "ifscCode": "SBIN0001234",
  "bankName": "State Bank of India"
}
```

### Response

```json
{
  "beneficiaryId": 1,
  "customerId": 30,
  "beneficiaryName": "Jane Doe",
  "accountNumber": "123456789012",
  "ifscCode": "SBIN0001234",
  "bankName": "State Bank of India",
  "status": "ACTIVE"
}
```

---

### 2. Get Beneficiary by ID

```http
GET /api/beneficiaries/{id}
```

Example:

```http
GET /api/beneficiaries/1
```

No request body is required.

---

### 3. Get Beneficiaries by Customer

```http
GET /api/beneficiaries/customer/{customerId}
```

Example:

```http
GET /api/beneficiaries/customer/30
```

No request body is required.

### Response

```json
[
  {
    "beneficiaryId": 1,
    "customerId": 30,
    "beneficiaryName": "Jane Doe",
    "accountNumber": "123456789012",
    "ifscCode": "SBIN0001234",
    "bankName": "State Bank of India",
    "status": "ACTIVE"
  }
]
```

---

### 4. Update Beneficiary

```http
PUT /api/beneficiaries/{id}
```

Example:

```http
PUT /api/beneficiaries/1
```

### Request Body

```json
{
  "customerId": 30,
  "beneficiaryName": "Jane Smith",
  "accountNumber": "123456789012",
  "ifscCode": "HDFC0001234",
  "bankName": "HDFC Bank"
}
```

---

### 5. Delete Beneficiary

```http
DELETE /api/beneficiaries/{id}
```

Example:

```http
DELETE /api/beneficiaries/1
```

No request body is required.

Successful deletion returns:

```text
204 No Content
```

---

## Beneficiary Status

A beneficiary can have one of the following statuses:

```text
ACTIVE
INACTIVE
```

Newly created beneficiaries are assigned:

```text
ACTIVE
```

---

## Validation

The create and update APIs validate:

- Customer ID is required and must be positive
- Beneficiary name is required
- Account number is required
- IFSC code is required
- Bank name is required

---

## Error Handling

The service uses a global exception handler.

### Beneficiary Not Found

When a requested beneficiary does not exist:

```text
HTTP 404 NOT_FOUND
```

Example:

```json
{
  "timestamp": "2026-08-19T15:00:00",
  "status": 404,
  "error": "Not Found",
  "message": "Beneficiary not found with ID: 1"
}
```

---

## Database

The service uses an H2 in-memory database for development and testing.

Database URL:

```text
jdbc:h2:mem:beneficiarydb
```

H2 Console:

```text
http://localhost:8085/h2-console
```

---

## Project Structure

```text
src/main/java/com/bankingapp/beneficiaryservice
│
├── controller
│   └── BeneficiaryController.java
│
├── dto
│   ├── BeneficiaryRequest.java
│   └── BeneficiaryResponse.java
│
├── entity
│   └── Beneficiary.java
│
├── enums
│   └── BeneficiaryStatus.java
│
├── exception
│   ├── BeneficiaryNotFoundException.java
│   └── GlobalExceptionHandler.java
│
├── repository
│   └── BeneficiaryRepository.java
│
└── service
    ├── BeneficiaryService.java
    └── BeneficiaryServiceImpl.java
```

---

## Running the Service

Make sure Java 21 is configured.

Run using Maven:

```bash
mvn spring-boot:run
```

The service starts on:

```text
http://localhost:8085
```

---

## Testing

The following endpoints have been tested successfully:

```text
POST   /api/beneficiaries
GET    /api/beneficiaries/{id}
GET    /api/beneficiaries/customer/{customerId}
PUT    /api/beneficiaries/{id}
DELETE /api/beneficiaries/{id}
```

The delete operation was also verified by requesting the deleted beneficiary and receiving:

```text
404 Not Found
```

---

## Current Status

The independent Beneficiary Management module is implemented and tested.

Completed:

- Beneficiary entity
- Beneficiary status
- Request and response DTOs
- Repository
- Service layer
- REST controller
- Validation
- Exception handling
- H2 persistence
- Create operation
- Read operations
- Update operation
- Delete operation
- Endpoint testing