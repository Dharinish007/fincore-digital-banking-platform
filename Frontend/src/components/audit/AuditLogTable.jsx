import {
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaSignInAlt,
  FaUserPlus,
  FaEdit,
  FaTrash,
  FaMoneyCheckAlt,
  FaShieldAlt,
} from "react-icons/fa";

import "./AuditLogTable.css";

function AuditLogTable({
  logs,
  onViewDetails,
}) {

  const getActionIcon = (action) => {

    switch (action) {

      case "LOGIN":
        return <FaSignInAlt />;

      case "CREATE":
        return <FaUserPlus />;

      case "UPDATE":
        return <FaEdit />;

      case "DELETE":
        return <FaTrash />;

      case "TRANSACTION":
        return <FaMoneyCheckAlt />;

      default:
        return <FaShieldAlt />;
    }
  };


  return (
    <div className="audit-table-card">

      <div className="audit-table-wrapper">

        <table className="audit-table">

          <thead>

            <tr>

              <th>Timestamp</th>

              <th>User</th>

              <th>Role</th>

              <th>Action</th>

              <th>Description</th>

              <th>IP Address</th>

              <th>Status</th>

              <th>Action</th>

            </tr>

          </thead>


          <tbody>

            {logs.length === 0 ? (

              <tr>

                <td
                  colSpan="8"
                  className="audit-empty"
                >
                  No audit logs found.
                </td>

              </tr>

            ) : (

              logs.map((log) => (

                <tr key={log.id}>

                  {/* Timestamp */}

                  <td>

                    <div className="audit-time">

                      <strong>
                        {log.date}
                      </strong>

                      <span>
                        {log.time}
                      </span>

                    </div>

                  </td>


                  {/* User */}

                  <td>

                    <div className="audit-user">

                      <div className="audit-avatar">
                        {log.initials}
                      </div>

                      <div>

                        <strong>
                          {log.user}
                        </strong>

                        <span>
                          {log.email}
                        </span>

                      </div>

                    </div>

                  </td>


                  {/* Role */}

                  <td>

                    <span
                      className={`audit-role ${log.role
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {log.role}
                    </span>

                  </td>


                  {/* Action */}

                  <td>

                    <div className="audit-action">

                      <div className="audit-action-icon">
                        {getActionIcon(log.action)}
                      </div>

                      <span>
                        {log.action}
                      </span>

                    </div>

                  </td>


                  {/* Description */}

                  <td>

                    <span className="audit-description">
                      {log.description}
                    </span>

                  </td>


                  {/* IP */}

                  <td>

                    <span className="audit-ip">
                      {log.ip}
                    </span>

                  </td>


                  {/* Status */}

                  <td>

                    {log.status === "Success" ? (

                      <span className="audit-status success">

                        <FaCheckCircle />

                        Success

                      </span>

                    ) : (

                      <span className="audit-status failed">

                        <FaTimesCircle />

                        Failed

                      </span>

                    )}

                  </td>


                  {/* View */}

                  <td>

                    <button
                      className="audit-view-btn"
                      onClick={() =>
                        onViewDetails(log)
                      }
                      title="View Details"
                    >
                      <FaEye />
                    </button>

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

export default AuditLogTable;