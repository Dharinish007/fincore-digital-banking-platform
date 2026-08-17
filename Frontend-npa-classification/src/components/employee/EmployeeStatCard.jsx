import "./EmployeeStatCard.css";

function EmployeeStatCard({
  icon,
  title,
  value,
  description,
  variant = "blue",
}) {
  return (
    <div className="employee-stat-card">

      <div className={`employee-stat-icon ${variant}`}>
        {icon}
      </div>

      <div className="employee-stat-content">
        <p>{title}</p>

        <h2>{value}</h2>

        <span>{description}</span>
      </div>

    </div>
  );
}

export default EmployeeStatCard;