import "./UserStatCard.css";

function UserStatCard({
  icon,
  title,
  value,
  description,
  variant = "blue",
}) {
  return (
    <div className="user-stat-card">

      <div className={`user-stat-icon ${variant}`}>
        {icon}
      </div>

      <div className="user-stat-content">
        <p>{title}</p>

        <h2>{value}</h2>

        <span>{description}</span>
      </div>

    </div>
  );
}

export default UserStatCard;