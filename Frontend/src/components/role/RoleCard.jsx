import {
  FaUserShield,
  FaUsers,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

import "./RoleCard.css";

function RoleCard({
  role,
  description,
  users,
  permissions,
  icon,
  variant,
  onEdit,
  onDelete,
}) {
  return (
    <div className="role-card">

      {/* Header */}
      <div className="role-card-header">

        <div className={`role-icon ${variant}`}>
          {icon}
        </div>

        <div className="role-actions">

          <button
            className="role-action edit"
            onClick={onEdit}
            title="Edit Role"
          >
            <FaEdit />
          </button>

          <button
            className="role-action delete"
            onClick={onDelete}
            title="Delete Role"
          >
            <FaTrash />
          </button>

        </div>

      </div>


      {/* Role Information */}
      <div className="role-card-content">

        <h3>{role}</h3>

        <p>
          {description}
        </p>

      </div>


      {/* Role Statistics */}
      <div className="role-card-stats">

        <div className="role-stat">

          <FaUsers />

          <div>
            <strong>{users}</strong>
            <span>Users</span>
          </div>

        </div>


        <div className="role-stat">

          <FaUserShield />

          <div>
            <strong>{permissions}</strong>
            <span>Permissions</span>
          </div>

        </div>

      </div>

    </div>
  );
}

export default RoleCard;