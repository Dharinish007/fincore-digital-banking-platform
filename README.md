# FinCore Digital Banking Platform — Milestone 1 (Database)

**Role:** Database Design & Management
**Branch:** team-a
**Database engine:** PostgreSQL

## Overview

This milestone covers the design, creation, and seeding of the FinCore database
that the backend microservices (account-service, and eventually
customer-service, payment-service, loan-service) connect to.

## What was built

### 1. Schema — `fincore_database_postgres.sql`

Four tables covering the core banking domain used by the frontend and
account-service:

| Table | Purpose |
|---|---|
| `customers` | Customer profile and KYC/risk data |
| `accounts` | Bank accounts linked to a customer |
| `transactions` | Deposits, withdrawals, and transfers between accounts |
| `audit_log` | System event trail (info/success/warn/error) for compliance and debugging |

**Key design decisions:**
- Primary keys use `BIGSERIAL` (Postgres auto-incrementing identity)
- Foreign keys enforce referential integrity within the database:
  `accounts.customer_id → customers.customer_id`,
  `transactions.from_account_id / to_account_id → accounts.account_id`
- `CHECK` constraints restrict enum-style columns to valid values
  (e.g. `kyc_status IN ('PENDING','VERIFIED','REJECTED')`), so invalid
  data can't be inserted even by mistake or by a buggy client
- Indexes added on foreign-key and frequently-filtered columns
  (`customer_id`, `from_account_id`, `to_account_id`, `transaction_date`,
  `transaction_status`) to keep lookups fast as data grows
- `balance >= 0` and `amount > 0` constraints prevent invalid financial data
  at the database level, not just in application code

### 2. Seed data

Realistic sample data for development and demo purposes:
- 25 customers (varied KYC status and risk level)
- 35 accounts (savings, current, fixed deposit; varied status)
- 60 transactions (transfers, deposits, withdrawals; success/pending/failed/reversed)
- 40 audit log entries

This lets the backend and frontend teams test against real-shaped data
immediately, without needing to manually create records first.

### 3. Database connection setup

Configured to match the account-service's `application.properties`:
```
jdbc:postgresql://localhost:5432/BankingApp
```

Setup steps:
```bash
psql -U postgres -c "CREATE DATABASE \"BankingApp\";"
psql -U postgres -d BankingApp -f fincore_database_postgres.sql
```

## Integration review

As part of this milestone, the existing `account-service` code was reviewed
against this schema to confirm the backend and database actually line up.
Four mismatches were found and documented for the backend team to resolve:

| # | Issue | Impact |
|---|---|---|
| 1 | `Account.java` maps to table `account_service`, but the schema creates `accounts` | Hibernate creates a second, empty table — API returns no data even though seed data exists |
| 2 | `AccountType` enum missing `FIXED_DEPOSIT` (present in schema + frontend) | Selecting that account type in the UI fails |
| 3 | `AccountStatus` enum uses `BLOCKED`, schema/frontend use `SUSPENDED` | Same status, different names — mismatch on write/read |
| 4 | Controller serves `/accounts`, frontend calls `/api/accounts` | 404s on every account API call until a context path or frontend base URL is fixed |

These are documented as inline comments at the bottom of
`fincore_database_postgres.sql` as well, so they stay visible in the repo.

## Files in this milestone

```
fincore_database_postgres.sql   -- schema + seed data, ready to run
README.md                        -- this file
```

## Next steps (Milestone 2)

- [ ] Backend team resolves the 4 integration issues above
- [ ] Extend schema for `customer-service` once its entities are written
      (currently an empty module in the repo)
- [ ] Add schemas for `payment-service` and `loan-service` when those
      modules are created
- [ ] Add database views for common reports (active account balances,
      overdue EMIs, failed transactions)
- [ ] Add a stored procedure for atomic fund transfers (debit + credit +
      audit log insert in one transaction)
- [ ] Create per-service database users with least-privilege access
      instead of everything connecting as the `postgres` superuser
