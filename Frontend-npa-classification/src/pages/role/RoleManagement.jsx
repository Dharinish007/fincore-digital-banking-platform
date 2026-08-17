import { useState } from "react";

import {
  FaUserShield,
  FaUserTie,
  FaUser,
  FaCashRegister,
  FaPlus,
  FaSearch,
} from "react-icons/fa";

import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminNavbar from "../../components/admin/AdminNavbar";

import RoleCard from "../../components/role/RoleCard";
import PermissionList from "../../components/role/PermissionList";

import "./RoleManagement.css";


function RoleManagement() {

  const [selectedRole, setSelectedRole] = useState("Administrator");

  const [searchTerm, setSearchTerm] = useState("");


  /* ==========================================
     Role Data
  ========================================== */

  const roles = [
    {
      role: "Administrator",
      description:
        "Full access to banking operations, employees, users and system configuration.",
      users: 1,
      permissions: 12,
      variant: "blue",
      icon: <FaUserShield />,
    },

    {
      role: "Manager",
      description:
        "Manage banking operations, employees and customer accounts within assigned authority.",
      users: 3,
      permissions: 9,
      variant: "purple",
      icon: <FaUserTie />,
    },

    {
      role: "Teller",
      description:
        "Handle customer transactions, deposits, withdrawals and account services.",
      users: 12,
      permissions: 6,
      variant: "green",
      icon: <FaCashRegister />,
    },

    {
      role: "Customer",
      description:
        "Access personal accounts, transactions, balances and banking services.",
      users: 1250,
      permissions: 5,
      variant: "orange",
      icon: <FaUser />,
    },
  ];


  /* ==========================================
     Permission Data
  ========================================== */

  const permissions = [
    {
      name: "View Dashboard",
      description: "Access role-specific dashboard",
      enabled: true,
    },

    {
      name: "View Customers",
      description: "View registered customer accounts",
      enabled: true,
    },

    {
      name: "Manage Customers",
      description: "Create, update and manage customers",
      enabled: true,
    },

    {
      name: "View Employees",
      description: "View bank employees",
      enabled: selectedRole !== "Customer",
    },

    {
      name: "Manage Employees",
      description: "Add, update and manage employees",
      enabled: selectedRole === "Administrator",
    },

    {
      name: "Manage Roles",
      description: "Create and modify system roles",
      enabled: selectedRole === "Administrator",
    },

    {
      name: "View Transactions",
      description: "View banking transactions",
      enabled: selectedRole !== "Customer",
    },

    {
      name: "Process Transactions",
      description: "Process deposits and withdrawals",
      enabled:
        selectedRole === "Administrator" ||
        selectedRole === "Manager" ||
        selectedRole === "Teller",
    },

    {
      name: "View Reports",
      description: "Access banking reports",
      enabled:
        selectedRole === "Administrator" ||
        selectedRole === "Manager",
    },

    {
      name: "Audit Logs",
      description: "View system audit logs",
      enabled: selectedRole === "Administrator",
    },

    {
      name: "System Settings",
      description: "Manage system configuration",
      enabled: selectedRole === "Administrator",
    },

    {
      name: "Profile Management",
      description: "Manage personal profile",
      enabled: true,
    },
  ];


  /* ==========================================
     Search
  ========================================== */

  const filteredRoles = roles.filter((role) =>
    role.role
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );


  /* ==========================================
     Handlers
  ========================================== */

  const handleEdit = (role) => {
    alert(`Edit ${role} role`);
  };


  const handleDelete = (role) => {

    if (role === "Administrator") {
      alert("Administrator role cannot be deleted.");
      return;
    }

    alert(`Delete ${role} role`);
  };


  return (

    <div className="role-management-page">

      <AdminSidebar />

      <div className="role-management-main">

        <AdminNavbar />


        <main className="role-management-content">

          {/* ==========================================
              Header
          ========================================== */}

          <div className="role-page-header">

            <div>

              <span className="role-page-label">
                ACCESS CONTROL
              </span>

              <h1>
                Role Management
              </h1>

              <p>
                Manage system roles and control permissions
                across the banking platform.
              </p>

            </div>


            <button className="add-role-btn">

              <FaPlus />

              Add New Role

            </button>

          </div>


          {/* ==========================================
              Search
          ========================================== */}

          <div className="role-search-container">

            <FaSearch />

            <input
              type="text"
              placeholder="Search roles..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
            />

          </div>


          {/* ==========================================
              Role Cards
          ========================================== */}

          <section className="roles-section">

            <div className="role-section-header">

              <div>

                <h2>
                  System Roles
                </h2>

                <p>
                  Manage access levels and responsibilities.
                </p>

              </div>

              <span>
                {filteredRoles.length} Roles
              </span>

            </div>


            <div className="roles-grid">

              {filteredRoles.map((role) => (

                <div
                  key={role.role}
                  onClick={() =>
                    setSelectedRole(role.role)
                  }
                  className={
                    selectedRole === role.role
                      ? "role-card-wrapper selected"
                      : "role-card-wrapper"
                  }
                >

                  <RoleCard
                    role={role.role}
                    description={role.description}
                    users={role.users}
                    permissions={role.permissions}
                    icon={role.icon}
                    variant={role.variant}
                    onEdit={(e) => {
                      e.stopPropagation();
                      handleEdit(role.role);
                    }}
                    onDelete={(e) => {
                      e.stopPropagation();
                      handleDelete(role.role);
                    }}
                  />

                </div>

              ))}

            </div>

          </section>


          {/* ==========================================
              Permissions
          ========================================== */}

          <section className="permissions-section">

            <PermissionList
              permissions={permissions}
            />

          </section>

        </main>

      </div>

    </div>
  );
}

export default RoleManagement;