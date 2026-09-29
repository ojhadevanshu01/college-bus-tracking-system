import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Clock3, MapPin, Radio, UserRound } from "lucide-react";
import { api } from "../api";
import { socket } from "../socket";
import MapView from "../components/MapView";

export default function TrackBus() {
  const { id } = useParams();
  const [bus, setBus] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api(`/public/buses/${id}`).then(setBus).catch(e => setError(e.message));
  }, [id]);

  useEffect(() => {
    if (!bus?.tripId) return;
    socket.connect();
    socket.emit("track:join", { tripId: bus.tripId });
    const handler = (location) => {
      setBus(prev => prev ? ({
        ...prev,
        status: "RUNNING",
        currentLocation: location
      }) : prev);
    };
    socket.on("bus:location", handler);
    return () => {
      socket.off("bus:location", handler);
      socket.disconnect();
    };
  }, [bus?.tripId]);

  if (error) return <div className="container page-pad"><div className="alert error">{error}</div></div>;
  if (!bus) return <div className="container page-pad"><div className="empty">Loading bus…</div></div>;

  return (
    <div className="container page-pad">
      <Link className="back-link" to="/"><ArrowLeft size={16}/> Back to all buses</Link>
      <div className="track-header">
        <div>
          <div className="eyebrow"><Radio size={15}/> Bus {bus.busNumber}</div>
          <h1>{bus.startPoint?.name} → {bus.endPoint?.name}</h1>
          <p>{bus.status === "RUNNING" ? "Live location is being received." : "This bus is not currently running."}</p>
        </div>
        <span className={bus.status === "RUNNING" ? "status running big" : "status idle big"}>
          {bus.status === "RUNNING" ? "● LIVE" : "○ NOT RUNNING"}
        </span>
      </div>
      <div className="track-grid">
        <MapView buses={[bus]} center={
          bus.currentLocation ? [bus.currentLocation.latitude, bus.currentLocation.longitude] :
          [bus.startPoint.latitude, bus.startPoint.longitude]
        } />
        <aside className="info-panel">
          <div className="info-row"><MapPin/><div><small>Route</small><strong>{bus.startPoint.name} → {bus.endPoint.name}</strong></div></div>
          <div className="info-row"><UserRound/><div><small>Driver</small><strong>{bus.assignedDriver?.name || "Not assigned"}</strong></div></div>
          <div className="info-row"><Clock3/><div><small>Last GPS update</small><strong>{bus.currentLocation?.updatedAt ? new Date(bus.currentLocation.updatedAt).toLocaleTimeString() : "—"}</strong></div></div>
        </aside>
      </div>
    </div>
  );
}