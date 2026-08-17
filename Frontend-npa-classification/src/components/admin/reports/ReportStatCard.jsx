import "./ReportStatCard.css";

function ReportStatCard({
  icon,
  title,
  value,
  description,
  variant = "blue",
}) {
  return (
    <div className="report-stat-card">

      <div className={`report-stat-icon ${variant}`}>
        {icon}
      </div>

      <div className="report-stat-content">
        <p>{title}</p>

        <h2>{value}</h2>

        <span>{description}</span>
      </div>

    </div>
  );
}

export default ReportStatCard;