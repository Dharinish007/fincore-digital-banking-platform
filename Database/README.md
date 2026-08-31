# Milestone 4 - Database Files
## Files

- `schema.sql` - Creates the MySQL database and all tables with primary keys, foreign keys, ENUMs, indexes and validation checks.
- `sample_data.sql` - Inserts realistic development/demo data.
- `queries.sql` - Useful queries for risk, compliance, audit and dashboard modules.

## Tables

1. customers
2. risk_scores
3. risk_factors
4. risk_score_history
5. compliance_checks
6. compliance_details
7. compliance_documents
8. audit_logs
9. audit_integrity
10. audit_alerts

## Main relationships

- customers -> risk_scores = 1:M
- customers -> risk_score_history = 1:M
- customers -> compliance_checks = 1:M
- risk_scores -> risk_factors = 1:M
- compliance_checks -> compliance_details = 1:M
- compliance_checks -> compliance_documents = 1:M
- audit_logs -> audit_integrity = 1:M
- audit_integrity -> audit_alerts = 1:M

## Important note

The ER diagram contains `user_id`, `performed_by`, `verified_by`, `changed_by`, `resolved_by`, etc., but it does not show a `users` table. Therefore these columns are kept as INT values without a foreign-key constraint. Main project already has a `users` table, these columns can be linked to it later.

## MySQL execution

Run in this order:

1. `schema.sql`
2. `sample_data.sql`
3. `queries.sql` 

The database name created is `milestone4_db`.

This design is intended for MySQL 8.0+.
