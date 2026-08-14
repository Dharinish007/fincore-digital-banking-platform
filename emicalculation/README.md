# FinCore Digital Banking Platform - EMI Calculation Module

A standalone Angular 19 frontend application for calculating reducing-balance Equated Monthly Installments (EMI) within the FinCore Digital Banking Platform ecosystem.

## Features

- **FinCore Enterprise Banking UI**: Dark theme matching FinCore core platform design language (`#111827` dark background, `#0D47A1` primary header, `#1E293B` cards).
- **Reducing-Balance EMI Calculation**: Uses standard banking EMI formula:
  $$EMI = \frac{P \times r \times (1+r)^n}{(1+r)^n - 1}$$
- **0% Interest Handling**: Handles interest-free repayment gracefully ($EMI = P / n$).
- **Reactive Validation**: Instant inline validation for required inputs (Loan Amount > 0, Interest Rate >= 0, Tenure > 0).
- **Frontend-Only**: No backend, REST API, or external database required.

## Input Parameters

1. **Loan Amount (₹)**: Numeric, Required, > 0
2. **Interest Rate (%)**: Numeric, Required, >= 0
3. **Loan Tenure (Months)**: Numeric, Required, > 0

## Calculation Output

- **Monthly EMI**: Equated monthly installment rounded to 2 decimal places.
- **Total Interest**: Cumulative interest payable over loan tenure.
- **Total Payment**: Total loan amount + total interest.

## Running the Application

Navigate to the `emicalculation` directory from the repository root:

```bash
cd emicalculation
```

Install dependencies:

```bash
npm install
```

Start the Angular development server:

```bash
npm run start
```

Open your browser at `http://localhost:4200/`.

## Verification Example

- **Loan Amount**: ₹ 100,000
- **Interest Rate**: 12% per annum
- **Tenure**: 12 months

**Expected Results**:
- **Monthly EMI**: ₹ 8,884.88
- **Total Interest**: ₹ 6,618.55
- **Total Payment**: ₹ 106,618.55
