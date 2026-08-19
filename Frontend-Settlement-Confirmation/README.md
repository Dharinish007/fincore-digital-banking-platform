# 🏦 FinCore — Digital Banking Management Platform

FinCore is a modern **Digital Banking Management Platform** designed to provide a secure, role-based banking experience for customers and bank employees.

The platform follows a **Role-Based Access Control (RBAC)** architecture where different users receive access to different dashboards and banking operations according to their assigned roles.

---

## 🚀 Project Overview

FinCore aims to provide a centralized digital banking platform for managing customers, employees, accounts, transactions, KYC verification, roles, audit logs, and other banking operations.

The system supports four primary roles:

- 👤 Customer
- 🛡️ Admin
- 👨‍💼 Manager
- 🏦 Teller

Each role has its own dedicated dashboard and navigation structure.

---

## 🎯 Project Objectives

The main objectives of FinCore are:

- Provide a modern digital banking interface.
- Implement Role-Based Access Control (RBAC).
- Provide separate dashboards for different banking roles.
- Allow customers to manage their banking activities.
- Allow administrators to manage employees and roles.
- Provide transaction monitoring and management.
- Support KYC verification workflows.
- Maintain audit logs for important banking activities.
- Build a scalable and maintainable frontend architecture.
- Provide a responsive user interface across different screen sizes.

---

# 🛠️ Technology Stack

## Frontend

| Technology | Purpose |
|---|---|
| React.js | Frontend framework |
| Vite | Development and build tool |
| JavaScript (ES6+) | Programming language |
| React Router DOM | Application routing |
| Axios | API communication |
| CSS3 | Styling |
| Bootstrap | UI utilities/components |
| React Icons | Icons |
| React Toastify | Notifications |

---

# 🏗️ Current Architecture

The frontend follows a component-based architecture.

```text
src/
│
├── components/
│   │
│   ├── admin/
│   │   ├── AdminSidebar.jsx
│   │   ├── AdminSidebar.css
│   │   ├── AdminNavbar.jsx
│   │   ├── AdminNavbar.css
│   │   ├── AdminStatCard.jsx
│   │   ├── AdminStatCard.css
│   │   ├── ManagementOverview.jsx
│   │   ├── ManagementOverview.css
│   │   ├── RecentTransactions.jsx
│   │   └── RecentTransactions.css
│   │
│   ├── customer/
│   │   ├── CustomerSidebar.jsx
│   │   ├── CustomerSidebar.css
│   │   ├── CustomerNavbar.jsx
│   │   ├── CustomerNavbar.css
│   │   ├── CustomerStatCard.jsx
│   │   ├── QuickActions.jsx
│   │   └── RecentTransactions.jsx
│   │
│   ├── manager/
│   │   ├── ManagerSidebar.jsx
│   │   ├── ManagerSidebar.css
│   │   ├── ManagerNavbar.jsx
│   │   ├── ManagerNavbar.css
│   │   └── ...
│   │
│   └── teller/
│       ├── TellerSidebar.jsx
│       ├── TellerSidebar.css
│       ├── TellerNavbar.jsx
│       ├── TellerNavbar.css
│       └── ...
│
├── pages/
│   │
│   ├── admin/
│   │   ├── AdminDashboard.jsx
│   │   └── AdminDashboard.css
│   │
│   ├── customer/
│   │   ├── CustomerDashboard.jsx
│   │   └── CustomerDashboard.css
│   │
│   ├── manager/
│   │   ├── ManagerDashboard.jsx
│   │   └── ManagerDashboard.css
│   │
│   └── teller/
│       ├── TellerDashboard.jsx
│       └── TellerDashboard.css
│
├── routes/
│   └── AppRoutes.jsx
│
├── App.jsx
├── main.jsx
└── index.css
