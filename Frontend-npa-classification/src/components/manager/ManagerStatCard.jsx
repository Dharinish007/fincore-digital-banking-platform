import "./ManagerStatCard.css";

function ManagerStatCard({
  icon,
  title,
  value,
  type,
}) {
  return (
    <div className="manager-stat-card">

      <div className={`manager-stat-icon ${type}`}>
        {icon}
      </div>

      <div>

        <p>{title}</p>

        <h2>{value}</h2>

      </div>

    </div>
  );
}

export default ManagerStatCard;