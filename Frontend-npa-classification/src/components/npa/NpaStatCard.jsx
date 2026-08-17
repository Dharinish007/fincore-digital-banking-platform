import "./NpaStatCard.css";

function NpaStatCard({ icon, title, value, description, variant = "blue" }) {
  return (
    <div className="npa-stat-card">

      <div className={`npa-stat-icon ${variant}`}>
        {icon}
      </div>

      <div className="npa-stat-content">
        <p>{title}</p>

        <h3>{value}</h3>

        <span>{description}</span>
      </div>

    </div>
  );
}

export default NpaStatCard;