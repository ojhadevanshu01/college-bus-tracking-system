import { useEffect, useState } from "react";
import { Link, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { BusFront, LayoutDashboard, LogIn, Map, Menu, ShieldCheck, UserRound, Users, X, Settings, Radio } from "lucide-react";
import PublicHome from "./pages/PublicHome";
import TrackBus from "./pages/TrackBus";
import DriverLogin from "./pages/DriverLogin";
import DriverRegister from "./pages/DriverRegister";
import DriverDashboard from "./pages/DriverDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import PassengerLogin from "./pages/PassengerLogin";
import PassengerRegister from "./pages/PassengerRegister";
import PassengerDashboard from "./pages/PassengerDashboard";

function PrivateRoute({ role, children }) {
  const token = localStorage.getItem("token");
  const savedRole = localStorage.getItem("role");
  if (!token || savedRole !== role) {
    const loginPath = role === "admin" ? "/admin/login" : role === "driver" ? "/driver/login" : "/passenger/login";
    return <Navigate to={loginPath} replace />;
  }
  return children;
}

function PublicNavbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem("role");
  const loggedIn = Boolean(localStorage.getItem("token"));
  useEffect(() => setOpen(false), [location.pathname]);
  const logout = () => { localStorage.clear(); navigate("/"); };
  return <header className="navbar"><div className="container nav-inner">
    <Link className="brand" to="/"><span className="brand-icon"><BusFront size={22}/></span><span>CampusBus</span></Link>
    <button className="mobile-menu" aria-label="Toggle navigation" onClick={() => setOpen(v=>!v)}>{open?<X/>:<Menu/>}</button>
    <nav className={open?"nav-links open":"nav-links"}>
      <Link to="/"><Map size={17}/> Live buses</Link>
      {role === "passenger" && <Link to="/passenger"><Users size={17}/> Passenger</Link>}
      {role === "driver" && <Link to="/driver"><LayoutDashboard size={17}/> Driver</Link>}
      {role === "admin" && <Link to="/admin"><ShieldCheck size={17}/> Admin</Link>}
      {!loggedIn && <Link to="/passenger/login"><UserRound size={17}/> Passenger</Link>}
      {!loggedIn && <Link to="/driver/login"><LogIn size={17}/> Driver</Link>}
      {!loggedIn && <Link to="/admin/login"><ShieldCheck size={17}/> Admin</Link>}
      {loggedIn && <button className="nav-logout" onClick={logout}><UserRound size={17}/> Logout</button>}
    </nav>
  </div></header>;
}

function DashboardShell({ role, children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const labels = { admin:"Operations center", driver:"Driver workspace", passenger:"Passenger portal" };
  const icons = { admin:ShieldCheck, driver:Radio, passenger:Users };
  const Icon = icons[role];
  const logout = () => { localStorage.clear(); navigate("/"); };
  const nav = role === "admin" ? [{to:"/admin",label:"Overview",icon:LayoutDashboard},{to:"/",label:"Live fleet",icon:Map}] : role === "driver" ? [{to:"/driver",label:"My workspace",icon:LayoutDashboard},{to:"/",label:"Live fleet",icon:Map}] : [{to:"/passenger",label:"My dashboard",icon:LayoutDashboard},{to:"/",label:"Live buses",icon:Map}];
  return <div className="app-shell">
    <aside className="sidebar">
      <div className="sidebar-brand"><div className="brand" style={{color:"#fff"}}><span className="brand-icon"><BusFront size={19}/></span><span>CampusBus</span></div><small>{labels[role]}</small></div>
      <nav className="sidebar-nav">{nav.map(item=>{const I=item.icon;return <Link className={location.pathname===item.to?"active":""} key={item.to} to={item.to}><I size={17}/>{item.label}</Link>})}<Link to="#"><Settings size={17}/> Settings</Link></nav>
      <div className="sidebar-footer"><div className="sidebar-user"><div className="avatar">{(user?.name||role||"U").slice(0,1).toUpperCase()}</div><div><strong>{user?.name || labels[role]}</strong><small>{user?.email || `${role} account`}</small></div></div><button className="nav-logout" style={{color:"#aab5ca",paddingLeft:0,marginTop:12}} onClick={logout}>Sign out</button></div>
    </aside>
    <section className="workspace"><header className="topbar"><div><h2>{labels[role]}</h2><p>Secure real-time campus transport management</p></div><div className="topbar-actions"><span className="status running"><Icon size={12}/> {role === "driver" ? "GPS ready" : "System online"}</span></div></header>{children}</section>
  </div>;
}

export default function App(){
  return <><PublicNavbar/><main><Routes>
    <Route path="/" element={<PublicHome/>}/><Route path="/track/:id" element={<TrackBus/>}/>
    <Route path="/passenger/login" element={<PassengerLogin/>}/><Route path="/passenger/register" element={<PassengerRegister/>}/>
    <Route path="/passenger" element={<PrivateRoute role="passenger"><DashboardShell role="passenger"><PassengerDashboard/></DashboardShell></PrivateRoute>}/>
    <Route path="/driver/login" element={<DriverLogin/>}/><Route path="/driver/register" element={<DriverRegister/>}/>
    <Route path="/driver" element={<PrivateRoute role="driver"><DashboardShell role="driver"><DriverDashboard/></DashboardShell></PrivateRoute>}/>
    <Route path="/admin/login" element={<AdminLogin/>}/><Route path="/admin" element={<PrivateRoute role="admin"><DashboardShell role="admin"><AdminDashboard/></DashboardShell></PrivateRoute>}/>
    <Route path="*" element={<Navigate to="/" replace/>}/>
  </Routes></main><footer className="footer">CampusBus • Production-ready real-time college transport experience</footer></>;
}
