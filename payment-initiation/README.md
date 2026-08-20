# Payment Initiation Module — Milestone 3

This is the standalone **Payment Initiation Frontend Module** for **FinCore Nexus Core Banking System**.

## 🚀 Quick Start Instructions

To run the application locally:
```bash
npm install
npm start
```
Then navigate to `http://localhost:4201/` in your web browser.

To build the production bundle:
```bash
npm run build
```

---

## 🗄️ Database Schema Implementation (SQL Source of Truth)

### 1. BENEFICIARY TABLE (`beneficiary`)
- `beneficiary_id`: BIGINT (Primary Key)
- `customer_id`: BIGINT
- `beneficiary_name`: VARCHAR(100)
- `account_no`: VARCHAR(20)
- `ifsc_code`: VARCHAR(20)
- `bank_name`: VARCHAR(100)
- `beneficiary_type`: ENUM('Internal', 'External')
- `status`: ENUM('Pending', 'Verified', 'Blocked')

### 2. PAYMENT TABLE (`payment`)
- `payment_id`: BIGINT (Primary Key)
- `from_account_no`: VARCHAR(20)
- `to_account_no`: VARCHAR(20)
- `beneficiary_id`: BIGINT
- `amount`: DECIMAL(15,2)
- `payment_type`: ENUM('Transfer', 'Bill Payment', 'Other')
- `payment_mode`: ENUM('IMPS', 'NEFT', 'RTGS', 'UPI')
- `payment_status`: ENUM('Pending', 'Processing', 'Success', 'Failed', 'Cancelled')
- `transaction_ref`: VARCHAR(50)
- `description`: TEXT
- `initiated_at`: DATETIME
- `updated_at`: DATETIME

### 3. FRAUD CHECK TABLE (`fraud_check`)
- `fraud_check_id`: BIGINT (Primary Key)
- `payment_id`: BIGINT
- `risk_score`: INT (Default 0)
- `fraud_status`: ENUM('Pending', 'Safe', 'Suspicious', 'Blocked')
- `rule_triggered`: VARCHAR(255)
- `remarks`: TEXT
- `checked_at`: DATETIME

---

## 📋 Module Architecture

```text
payment-initiation/
├── package.json
├── angular.json
├── tsconfig.json
├── tsconfig.app.json
└── src/
    ├── index.html
    ├── main.ts
    ├── styles.scss
    └── app/
        ├── app.component.ts
        ├── app.routes.ts
        ├── app.config.ts
        ├── components/
        │   ├── header/
        │   └── sidebar/
        └── payment-initiation/
            ├── payment-initiation.component.ts
            ├── payment-initiation.component.html
            ├── payment-initiation.component.scss
            ├── payment-initiation.service.ts
            └── models/
                ├── beneficiary.model.ts
                ├── payment.model.ts
                └── fraud-check.model.ts
```

---

## ✨ Features & User Flow

1. **From Account**: Dropdown select with mock accounts (`XXXXXX1234`, `XXXXXX5678`, `XXXXXX9012`).
2. **Beneficiary Selection**: Only `Verified` beneficiaries can be selected for payment.
3. **To Account Number**: Auto-populated readonly field from beneficiary.
4. **Amount Input**: Numeric currency input (`₹`), validation checks (> ₹0.00).
5. **Payment Type**: Dropdown (`Transfer`, `Bill Payment`, `Other`).
6. **Payment Mode**: Dropdown (`IMPS`, `NEFT`, `RTGS`, `UPI`).
7. **Description**: Optional transfer remarks.
8. **Review Step**: Summary screen with `Back / Edit` & `Confirm Payment` options.
9. **Processing State**: Animated loader with simulated real-time risk check steps.
10. **Success Result**: Displays generated transaction reference (`TXN-YYYYMMDD-XXXXXX`), summary receipt, and risk score.
