import "./AuditStatCard.css";

function AuditStatCard({
  icon,
  title,
  value,
  description,
  variant,
}) {
  return (
    <div className="audit-stat-card">

      <div className={`audit-stat-icon ${variant}`}>
        {icon}
      </div>

      <div className="audit-stat-content">

        <p>{title}</p>

        <h2>{value}</h2>

        <span>{description}</span>

      </div>

    </div>
  );
}

export default AuditStatCard;