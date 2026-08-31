💳 FinCore Digital Banking Platform — Milestone 3

📖 Overview

FinCore Digital Banking Platform is a full-stack digital banking application developed as part of Team D within the FinCore Nexus initiative.

Milestone 3 focuses on three important banking services:

1. Saga Execution
2. Settlement Confirmation
3. Notification Delivery

These services work together to support reliable transaction processing. Saga Execution coordinates multiple steps in a transaction, Settlement Confirmation verifies the successful completion of the financial process, and Notification Delivery informs users about transaction status and important events.

The application follows a layered architecture using a React frontend, Java Spring Boot backend, REST APIs, and MySQL database.

---

✨ Features

🔄 Saga Execution

* Coordinates multi-step banking transactions
* Tracks the status of each transaction step
* Manages successful transaction completion
* Handles transaction failures
* Supports compensation/recovery when a step fails
* Maintains transaction execution status
* Provides backend APIs for saga operations

💰 Settlement Confirmation

* Verifies settlement completion
* Tracks settlement status
* Maintains transaction/reference information
* Records confirmation details
* Updates final transaction status
* Provides settlement information through REST APIs
* Stores settlement records in MySQL

🔔 Notification Delivery

* Generates transaction-related notifications
* Sends status updates to users
* Supports success and failure notifications
* Tracks notification delivery status
* Stores notification information
* Displays relevant notifications through the frontend

💻 User Interface

* React-based frontend
* Service-specific pages and dashboards
* Transaction status display
* Settlement status display
* Notification/status messages
* Responsive enterprise banking interface

---

🛠 Tech Stack

Frontend

* React
* JavaScript
* HTML5
* CSS3

Backend

* Java
* Spring Boot
* Spring Security
* REST APIs
* Spring Data JPA

Database

* MySQL
* XAMPP / phpMyAdmin

Development Tools

* Git
* GitHub
* Maven
* npm
* IntelliJ IDEA
* Visual Studio Code

---

🏗️ Service Architecture

                    ┌─────────────────────┐
                    │   React Frontend    │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Spring Boot REST    │
                    │       APIs          │
                    └──────────┬──────────┘
                               │
             ┌─────────────────┼─────────────────┐
             ▼                 ▼                 ▼
     ┌───────────────┐ ┌───────────────┐ ┌────────────────┐
     │ Saga Execution│ │   Settlement  │ │  Notification  │
     │    Service    │ │ Confirmation  │ │    Delivery    │
     └───────┬───────┘ └───────┬───────┘ └───────┬────────┘
             │                 │                 │
             └─────────────────┼─────────────────┘
                               ▼
                    ┌─────────────────────┐
                    │   MySQL Database    │
                    └─────────────────────┘

---


📷 Application Screenshots

🔄 Saga Execution

"Saga Execution" (Screenshots/saga-execution.jpg)

💰 Settlement Confirmation

"Settlement Confirmation" (Screenshots/settlement-confirmation.jpg)

🔔 Notification Delivery

"Notification Delivery" (Screenshots/notification-delivery.jpg)





▶️ Running the Project

Prerequisites

Make sure the following are installed:

* Java JDK
* Maven
* Node.js
* npm
* MySQL
* Git

---

🗄️ Database Setup

Make sure MySQL is running on:

localhost:3306

Create the required database and execute the project's SQL files:

database/schema.sql
database/sample_data.sql

Update the Spring Boot database configuration with your MySQL credentials.

Example:

spring.datasource.url=jdbc:mysql://localhost:3306/fincore_db
spring.datasource.username=root
spring.datasource.password=root

---

🔄 Saga Execution Backend

Open the Saga service directory:

cd saga-service

Run:

.\mvnw.cmd spring-boot:run

Or:

mvn spring-boot:run

---

💰 Settlement Confirmation Backend

Open the settlement service:

cd settlement-service

Run:

.\mvnw.cmd spring-boot:run

---

🔔 Notification Delivery Backend

Open the notification service:

cd notification-service

Run:

.\mvnw.cmd spring-boot:run

---

💻 Frontend

Open the React frontend:

cd Frontend

Install dependencies:

npm install

Start the development server:

npm run dev

Open the URL displayed by the React development server.

---

🧪 Testing the Services

After starting the application:

1. Open the React frontend.
2. Initiate the required transaction/workflow.
3. Verify that Saga Execution processes the transaction steps.
4. Check the Settlement Confirmation status.
5. Verify that the transaction result is stored in MySQL.
6. Check whether Notification Delivery is triggered.
7. Verify the notification/status displayed to the user.

---

📌 Core Modules

Module| Description
🔄 Saga Execution| Coordinates multi-step transaction processing
💰 Settlement Confirmation| Confirms successful financial settlement
🔔 Notification Delivery| Sends transaction and status notifications
💻 React Frontend| Provides user interaction and service views
⚙️ Spring Boot Backend| Provides REST APIs and business logic
🗄️ MySQL Database| Stores transaction and service information

---

🔀 Version Control

Team D development is maintained using Git and GitHub.

The Milestone 3 implementation contains:

* Saga Execution
* Settlement Confirmation
* Notification Delivery
* Frontend components
* Backend services
* Database changes
* Application screenshots


| **Team Member**      | **Responsibility**                                |
| -------------------- | ------------------------------------------------- |
| Soumya Ranjan Puthal | Frontend – Saga Execution                         |
| Sharvari Shalgar     | Backend – Notification Delivery                   |
| Tharun M             | Frontend – Notification Delivery                  |
| Vaishnavi Mahadik    | Frontend – Notification Delivery                  |
| Thejashree B         | Frontend – Settlement Confirmation                |
| Sathiya Priya        | Backend – Saga Execution, Settlement Confirmation |
| Warkar Vaishnavi     | Database Design & Project Integration             |


---

📝 Conclusion

Saga Execution provides reliable coordination of multi-step transactions, Settlement Confirmation verifies the final financial state, and Notification Delivery keeps users informed about transaction outcomes.

The combination of React, Java Spring Boot, REST APIs, and MySQL provides a structured foundation for integrating these services into the complete digital banking platform.

«"Execute reliably, settle accurately, and notify instantly."»
