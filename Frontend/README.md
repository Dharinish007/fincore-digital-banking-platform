# 🌐 FinCore Frontend - Digital Banking UI

The **FinCore Frontend** is a modern, responsive single-page web application built with **Angular 18** and **TypeScript**, styled using Tailwind CSS and custom banking UI components. It provides a full-featured management interface for core banking operations, loan servicing, interbank settlements, real-time fraud detection, AI biometric KYC liveness verification, risk assessment, and immutable audit logs.

---

## 📑 Features & Modules

- **📊 Dashboard & Core Analytics (`/dashboard`, `/core-dashboard`)**
  - KPI overview: Total portfolio balance, active accounts, daily volume, system health metrics.
  - Interactive charts and quick transaction shortcuts.

- **👤 Account Lifecycle & Balance Management (`/accounts`, `/balance`)**
  - Customer account creation (Savings, Current, Fixed Deposit).
  - Status management (Active, Suspended, Frozen, Closed).
  - Real-time balance enquiry, credit/debit operations, and ledger sync.

- **📑 Statement Generation & Export (`/statements`)**
  - Date-range filtered statement generation.
  - Export capabilities to **PDF** (via `jspdf` & `jspdf-autotable`) and **Excel** (via `xlsx`).

- **💳 Loan Management & Servicing (`/loans`)**
  - **Servicing**: Loan origination, interest rate rules, and outstanding balance tracking.
  - **EMI**: Reducing balance amortization schedule computation.
  - **Disbursement**: Multi-stage approval and fund disbursement.
  - **Collections**: Receipt generation, overdue tracking, and penalty allocation.

- **⚡ Interbank Settlement Engine (`/settlement`)**
  - Real-time gross settlement & net batch settlement processor.
  - Multi-bank clearing reconciliation and transaction status tracking.

- **🛡️ Real-Time Fraud Detection (`/fraud-detection`)**
  - Instant rule evaluation engine (transaction amount thresholds, velocity spikes, geofence / international anomalies, device finger-printing, failed PIN/2FA attempts).
  - Instant risk categorization: `SAFE`, `SUSPICIOUS`, `UNDER_REVIEW`, `BLOCKED`.
  - Live activity feed showing recent evaluated transactions.

- **👁️ AI Biometric KYC & Face Liveness (`/liveness`)**
  - Real-time camera feed integration with **Google MediaPipe Face Mesh** (`@mediapipe/tasks-vision`).
  - Active liveness challenge detection (Blink, Turn Head, Smile).
  - Verification certificate generation and pass/fail audit storage.

- **⚖️ Risk Assessment & Decisioning (`/risk`)**
  - Multi-factor risk scoring engine for credit and high-value transfers.
  - Automated threat rating with human-in-the-loop review workflow.

- **📜 Immutable Audit Trail (`/audit`)**
  - Enterprise audit logging with user actors, module tags, IP tracking, and timestamp verification.

---

## 🛠️ Tech Stack & Dependencies

| Technology | Version | Purpose |
|---|---|---|
| **Angular** | `18.2.0` | Frontend Framework (Standalone Components & Signals) |
| **TypeScript** | `5.4.5` | Type-Safe Application Logic |
| **RxJS** | `7.8.0` | Reactive Event Handling and Observables |
| **MediaPipe Tasks Vision** | `1.0.1` | Real-time AI Face Mesh & Liveness Verification |
| **jsPDF / AutoTable** | `2.5.1` | Client-Side PDF Generation |
| **XLSX** | `0.18.5` | Excel Sheet Generation |
| **Tailwind CSS / Lucide Icons** | Latest | Modern Design System & Banking Components |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v18.x` or `v20.x` or higher
- **npm**: `v9.x` or `v10.x`
- **Angular CLI**: `npm install -g @angular/cli` (Optional, `npx ng` works out of the box)

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Development Server

Start the local development server:
```bash
npm start
# or
ng serve
```

Open your browser and navigate to:
```
http://localhost:4200
```
The application will automatically reload when source files are modified.

---

## 🏗️ Build & Production Deployment

To build the project for production:

```bash
npm run build
```

The compiled build output will be stored in the `Frontend/dist/` directory.

---

## 📡 Backend API Integration

The frontend communicates with the Spring Boot backend REST APIs via `Frontend/src/app/services/api.service.ts`:
- **Default Backend URL**: `http://localhost:8080`
- Configurable endpoints for `/api/customers`, `/api/accounts`, `/api/loans`, `/api/settlement`, `/api/fraud`, `/api/risk`, `/api/liveness`, and `/api/audit`.



Contributors

Bharathi Bhat

Chaava Ramya

Shanmukha Sai

Raziya
