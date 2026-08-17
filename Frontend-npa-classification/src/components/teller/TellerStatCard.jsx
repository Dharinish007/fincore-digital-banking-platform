import "./TellerStatCard.css";

function TellerStatCard({
  icon,
  title,
  value,
  type,
}) {
  return (
    <div className="teller-stat-card">

      <div className={`teller-stat-icon ${type}`}>
        {icon}
      </div>

      <div>

        <p>{title}</p>

        <h2>{value}</h2>

      </div>

    </div>
  );
}

export default TellerStatCard;