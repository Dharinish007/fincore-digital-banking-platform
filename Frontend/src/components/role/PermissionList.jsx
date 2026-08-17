import {
  FaCheck,
  FaTimes,
} from "react-icons/fa";

import "./PermissionList.css";

function PermissionList({ permissions }) {

  return (
    <div className="permission-list">

      <div className="permission-list-header">

        <div>
          <h3>Role Permissions</h3>

          <p>
            Permissions assigned to this role.
          </p>
        </div>

      </div>


      <div className="permissions-grid">

        {permissions.map((permission) => (

          <div
            className="permission-item"
            key={permission.name}
          >

            <div
              className={`permission-status ${
                permission.enabled ? "enabled" : "disabled"
              }`}
            >
              {permission.enabled ? (
                <FaCheck />
              ) : (
                <FaTimes />
              )}
            </div>

            <div>

              <strong>
                {permission.name}
              </strong>

              <span>
                {permission.description}
              </span>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default PermissionList;