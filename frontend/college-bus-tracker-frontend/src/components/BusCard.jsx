import { ArrowRight, CircleDot, MapPin, Radio } from "lucide-react";
import { Link } from "react-router-dom";

export default function BusCard({ bus, onClick }) {
  const running = bus.status === "RUNNING";
  return (
    <article className="bus-card" onClick={onClick}>
      <div className="bus-card-top">
        <div>
          <span className="bus-number"><Radio size={16}/> {bus.busNumber}</span>
          <h3>{bus.startPoint?.name} <ArrowRight size={16}/> {bus.endPoint?.name}</h3>
        </div>
        <span className={running ? "status running" : "status idle"}>
          <CircleDot size={12}/> {running ? "Live" : "Not running"}
        </span>
      </div>
      <div className="route-meta">
        <span><MapPin size={15}/> Driver: {bus.assignedDriver?.name || "Unassigned"}</span>
      </div>
      <Link className="small-link" to={`/track/${bus._id}`}>Track this bus →</Link>
    </article>
  );
}