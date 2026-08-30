import "./AdminStatCard.css";

function AdminStatCard({
  icon,
  title,
  value,
  description,
  growth,
  growthType = "positive",
  iconColor = "blue",
}) {
  return (
    <div className="admin-stat-card">

      {/* Top Section */}
      <div className="admin-stat-card-top">

        <div className={`admin-stat-icon ${iconColor}`}>
          {icon}
        </div>

        {growth && (
          <span className={`admin-stat-growth ${growthType}`}>
            {growth}
          </span>
        )}

      </div>

      {/* Card Content */}
      <div className="admin-stat-content">

        <p>{title}</p>

        <h2>{value}</h2>

        <span>{description}</span>

      </div>

    </div>
  );
}

export default AdminStatCard;