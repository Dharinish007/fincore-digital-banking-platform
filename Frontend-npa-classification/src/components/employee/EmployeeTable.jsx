import {
  FaEdit,
  FaTrash,
  FaUserCircle,
} from "react-icons/fa";

import "./EmployeeTable.css";

function EmployeeTable({ employees = [], onEdit, onDelete }) {

  return (
    <div className="employee-table-card">

      {/* ==========================================
          Header
      ========================================== */}

      <div className="employee-table-header">

        <div>
          <h2>Employee List</h2>

          <p>
            Manage bank employees and their assigned roles.
          </p>
        </div>

      </div>


      {/* ==========================================
          Table
      ========================================== */}

      <div className="employee-table-wrapper">

        <table className="employee-table">

          <thead>

            <tr>
              <th>Employee</th>
              <th>Employee ID</th>
              <th>Role</th>
              <th>Department</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>

          </thead>


          <tbody>

            {employees.length === 0 ? (

              <tr>
                <td
                  colSpan="6"
                  className="employee-empty"
                >
                  No employees found.
                </td>
              </tr>

            ) : (

              employees.map((employee) => (

                <tr key={employee.id}>

                  {/* Employee */}

                  <td>

                    <div className="employee-info">

                      <div className="employee-avatar">
                        <FaUserCircle />
                      </div>

                      <div>
                        <strong>
                          {employee.name}
                        </strong>

                        <span>
                          {employee.email}
                        </span>
                      </div>

                    </div>

                  </td>


                  {/* ID */}

                  <td>
                    {employee.employeeId}
                  </td>


                  {/* Role */}

                  <td>

                    <span
                      className={`employee-role ${employee.role
                        ?.toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      {employee.role}
                    </span>

                  </td>


                  {/* Department */}

                  <td>
                    {employee.department}
                  </td>


                  {/* Status */}

                  <td>

                    <span
                      className={`employee-status ${
                        employee.status === "Active"
                          ? "active"
                          : "inactive"
                      }`}
                    >
                      {employee.status}
                    </span>

                  </td>


                  {/* Actions */}

                  <td>

                    <div className="employee-actions">

                      <button
                        className="employee-edit-btn"
                        onClick={() => onEdit?.(employee)}
                        title="Edit Employee"
                      >
                        <FaEdit />
                      </button>

                      <button
                        className="employee-delete-btn"
                        onClick={() => onDelete?.(employee)}
                        title="Delete Employee"
                      >
                        <FaTrash />
                      </button>

                    </div>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default EmployeeTable;