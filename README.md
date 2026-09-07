# FinCore Digital Banking Platform

FinCore Milestone 4 adds a security and risk workflow to the existing Angular and Spring Boot banking platform.

## Security Flow

The `/liveness` screen runs a persisted liveness session, requests a 640x480 browser camera stream, detects one face with MediaPipe Tasks Vision landmarks, and evaluates blink, head-turn, and smile signals in sequence. A successful face result unlocks the six-digit passcode step. Passcodes are checked with BCrypt by Spring Boot and are never stored in plaintext, browser storage, or audit records.

Risk and audit features remain available at `/risk` and `/audit`. The frontend contains only liveness verification, risk assessment, and audit logging modules.

## Run Locally

1. Create a PostgreSQL database named `fincore`.
2. Run `database.sql` against that database.
3. Set `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, and `DB_PASSWORD` in the backend environment. See `.env.example`.
4. Start the backend:

```powershell
cd Milestone3-Backend\milestone-3
.\mvnw.cmd spring-boot:run
```

5. Start the frontend:

```powershell
cd Frontend-milestone3
npm ci
npm start
```

Open `http://localhost:4200`.

## Notes

The confidence score is a demonstration score and is not a production biometric decision. MediaPipe model assets are loaded by the browser from the configured CDN. Camera video and raw biometric data are not sent to or stored by the backend.

There is deliberately no login, signup, JWT, OAuth, authentication, authorization, or auth guard in this application.
