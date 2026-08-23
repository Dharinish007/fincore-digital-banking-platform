# FinCore Nexus — Infosys Milestone 3: Saga Execution Frontend

React/Vite frontend for the Saga Execution module of the Secure Digital Banking Platform / Transaction Management System. The design follows the supplied Milestone-2 Disbursement Saga screenshot: dark navy operations console, blue FinCore header, left navigation, bordered cards and operational status colors.

## Run in VS Code

```bash
npm install
npm run dev
```

Open the Vite localhost URL, normally `http://localhost:5173`.

## Saga Execution features
- Saga execution dashboard and operational KPIs
- Current Saga orchestration lifecycle
- Recent Saga executions
- Search and status filtering
- Saga trace/detail drawer
- Step-level state and execution timing
- Failed Saga compensation information
- Retry action
- Settlement Confirmation handoff
- Notification Delivery handoff
- Execution throughput and compensation queue

## Backend integration points
Replace the mock data in `src/main.jsx` with your team APIs such as `GET /api/sagas`, `GET /api/sagas/:id`, `POST /api/sagas`, `POST /api/sagas/:id/retry`, metrics, and WebSocket/SSE live updates.
