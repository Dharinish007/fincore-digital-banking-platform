import {
  FaUserCog,
  FaUserShield,
  FaUserFriends,
} from "react-icons/fa";

import "./ManagementOverview.css";

function ManagementOverview() {
  return (
    <section className="management-overview">

      {/* Section Header */}
      <div className="management-header">

        <h2>Management Overview</h2>

        <p>
          Quick overview of your banking operations.
        </p>

      </div>


      {/* Overview Cards */}
      <div className="management-grid">

        {/* ==========================================
            Employee Management
        ========================================== */}

        <div className="management-card">

          <div className="management-icon blue">
            <FaUserCog />
          </div>

          <div className="management-content">

            <h3>Employee Management</h3>

            <p>
              Manage bank employees and assign their access roles.
            </p>

            <div className="management-stats">

              <span>
                <strong>42</strong>
                Employees
              </span>

              <span>
                <strong>4</strong>
                Roles
              </span>

            </div>

          </div>

        </div>


        {/* ==========================================
            Role Management
        ========================================== */}

        <div className="management-card">

          <div className="management-icon purple">
            <FaUserShield />
          </div>

          <div className="management-content">

            <h3>Role Management</h3>

            <p>
              Control permissions and role-based access for employees.
            </p>

            <div className="management-stats">

              <span>
                <strong>4</strong>
                Roles
              </span>

              <span>
                <strong>12</strong>
                Permissions
              </span>

            </div>

          </div>

        </div>


        {/* ==========================================
            User Management
        ========================================== */}

        <div className="management-card">

          <div className="management-icon green">
            <FaUserFriends />
          </div>

          <div className="management-content">

            <h3>User Management</h3>

            <p>
              Monitor and manage registered customer accounts.
            </p>

            <div className="management-stats">

              <span>
                <strong>1,250</strong>
                Customers
              </span>

              <span>
                <strong>1,198</strong>
                Active
              </span>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default ManagementOverview;