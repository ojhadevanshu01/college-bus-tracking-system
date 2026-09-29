import { useEffect, useRef, useState } from "react";
import { BusFront, MapPin, Play, Square, Radio, UserRound, Gauge, Navigation } from "lucide-react";
import { api } from "../api";
import { setSocketAuth, socket } from "../socket";

export default function DriverDashboard(){
 const [data,setData]=useState(null),[error,setError]=useState(""),[gps,setGps]=useState(null); const watchRef=useRef(null);
 const load=()=>api("/driver/dashboard").then(setData).catch(e=>setError(e.message));
 useEffect(()=>{load();return()=>{if(watchRef.current)navigator.geolocation.clearWatch(watchRef.current);socket.disconnect()}},[]);
 const start=async()=>{try{setError("");const trip=await api("/driver/trips/start",{method:"POST",body:JSON.stringify({busId:data.bus._id})});setData(p=>({...p,trip}));setSocketAuth(localStorage.getItem("token"));socket.connect();startGPS(trip._id)}catch(e){setError(e.message)}};
 const startGPS=tripId=>{if(!navigator.geolocation)return setError("This browser does not support GPS.");if(watchRef.current)navigator.geolocation.clearWatch(watchRef.current);watchRef.current=navigator.geolocation.watchPosition(pos=>{const point={latitude:pos.coords.latitude,longitude:pos.coords.longitude};setGps(point);socket.emit("driver:location",{tripId,...point})},err=>setError(`GPS: ${err.message}`),{enableHighAccuracy:true,maximumAge:5000,timeout:15000})};
 const stop=async()=>{try{if(watchRef.current)navigator.geolocation.clearWatch(watchRef.current);if(data?.trip?._id)await api(`/driver/trips/${data.trip._id}/stop`,{method:"POST"});socket.disconnect();setGps(null);await load()}catch(e){setError(e.message)}};
 if(!data)return <div className="workspace-body"><div className="empty">Loading driver workspace…</div></div>;
 const running=Boolean(data.trip);
 return <div className="workspace-body">
   <div className="section-heading"><div><p className="eyebrow">Driver operations</p><h1>Good to see you, {data.driver?.name?.split(" ")[0]||"Driver"}</h1><p>Control your assigned bus and broadcast its location to passengers in real time.</p></div><span className={running?"status running big":"status idle big"}>{running?<><Radio size={13}/> LIVE TRIP</>:<>OFF DUTY</>}</span></div>
   {error&&<div className="alert error">{error}</div>}
   <div className="stats-grid"><div className="stat-card"><BusFront size={20}/><strong>{data.bus?.busNumber||"—"}</strong><span>Assigned bus</span></div><div className="stat-card"><Gauge size={20}/><strong>{running?"Live":"Ready"}</strong><span>Trip status</span></div><div className="stat-card"><Navigation size={20}/><strong>{gps?"Active":"Standby"}</strong><span>GPS signal</span></div><div className="stat-card"><UserRound size={20}/><strong>{data.driver?.approved?"Verified":"Pending"}</strong><span>Account</span></div></div>
   <div className="dashboard-two"><section className="panel"><div className="panel-header"><div className="panel-title"><BusFront/> Assigned vehicle</div><span className={running?"status running":"status idle"}>{running?"Broadcasting":"Parked"}</span></div>
    {data.bus?<><div className="bus-hero"><strong>Bus {data.bus.busNumber}</strong><span>{data.bus.startPoint.name} → {data.bus.endPoint.name}</span></div><div className="route-box"><span>{data.bus.startPoint.name}</span><span>→</span><span>{data.bus.endPoint.name}</span></div>{!running?<button className="button primary full" onClick={start}><Play size={16}/> Start trip & share GPS</button>:<button className="button danger full" onClick={stop}><Square size={16}/> End current trip</button>}</>:<div className="empty">No active bus has been assigned to your account.</div>}
   </section><section className="panel"><div className="panel-title"><Radio/> Live telemetry</div><div className="gps-card"><div className={running?"pulse live":"pulse"}></div><strong>{running?"Location sharing active":"Location sharing is off"}</strong><span>{gps?`${gps.latitude.toFixed(6)}, ${gps.longitude.toFixed(6)}`:"Start a trip to begin secure GPS broadcasting."}</span></div><div className="info-row"><MapPin/><div><small>Passenger visibility</small><strong>{running?"Your bus is visible on the live map":"Hidden until a trip starts"}</strong></div></div><div className="info-row"><UserRound/><div><small>Driver account</small><strong>{data.driver?.email}</strong></div></div></section></div>
 </div>;
}