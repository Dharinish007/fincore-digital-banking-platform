import {
  FaEdit,
  FaTrash,
  FaUserCircle,
  FaEye,
} from "react-icons/fa";

import "./UserTable.css";

function UserTable({
  users = [],
  onView,
  onEdit,
  onDelete,
}) {
  return (
    <div className="user-table-card">

      {/* ==========================================
          Header
      ========================================== */}

      <div className="user-table-header">

        <div>
          <h2>Customer List</h2>

          <p>
            View and manage registered customer accounts.
          </p>
        </div>

      </div>


      {/* ==========================================
          Table
      ========================================== */}

      <div className="user-table-wrapper">

        <table className="user-table">

          <thead>

            <tr>
              <th>Customer</th>
              <th>Customer ID</th>
              <th>Account Type</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>

          </thead>


          <tbody>

            {users.length === 0 ? (

              <tr>
                <td
                  colSpan="6"
                  className="user-empty"
                >
                  No customers found.
                </td>
              </tr>

            ) : (

              users.map((user) => (

                <tr key={user.id}>

                  {/* Customer */}

                  <td>

                    <div className="user-info">

                      <div className="user-avatar">
                        <FaUserCircle />
                      </div>

                      <div>
                        <strong>
                          {user.name}
                        </strong>

                        <span>
                          {user.email}
                        </span>
                      </div>

                    </div>

                  </td>


                  {/* Customer ID */}

                  <td>
                    {user.customerId}
                  </td>


                  {/* Account */}

                  <td>
                    {user.accountType}
                  </td>


                  {/* Phone */}

                  <td>
                    {user.phone}
                  </td>


                  {/* Status */}

                  <td>

                    <span
                      className={`user-status ${
                        user.status === "Active"
                          ? "active"
                          : "inactive"
                      }`}
                    >
                      {user.status}
                    </span>

                  </td>


                  {/* Actions */}

                  <td>

                    <div className="user-actions">

                      <button
                        className="user-view-btn"
                        onClick={() => onView?.(user)}
                        title="View Customer"
                      >
                        <FaEye />
                      </button>

                      <button
                        className="user-edit-btn"
                        onClick={() => onEdit?.(user)}
                        title="Edit Customer"
                      >
                        <FaEdit />
                      </button>

                      <button
                        className="user-delete-btn"
                        onClick={() => onDelete?.(user)}
                        title="Delete Customer"
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

export default UserTable;