import React from "react";
import "./CustomerStatCard.css";

function CustomerStatCard({
  icon,
  title,
  value,
  color,
}) {
  return (
    <div className="stat-card">

      <div
        className="stat-icon"
        style={{ background: color }}
      >
        {icon}
      </div>

      <div>

        <p>{title}</p>

        <h2>{value}</h2>

      </div>

    </div>
  );
}

export default CustomerStatCard;