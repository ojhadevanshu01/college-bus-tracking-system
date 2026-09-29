import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BusFront } from "lucide-react";
import { api } from "../api";

export default function DriverLogin() {
  return <AuthCard title="Driver login" subtitle="Sign in to start trips and share your live GPS." type="driver" />;
}

export function AuthCard({ title, subtitle, type = "driver" }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async e => {
    e.preventDefault();
    try {
      setBusy(true); setError("");
      const data = await api(`/auth/${type}/login`, { method: "POST", body: JSON.stringify(form) });
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", type);
      localStorage.setItem("user", JSON.stringify(data[type]));
      navigate(type === "admin" ? "/admin" : "/driver");
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <div className="auth-logo"><BusFront/></div>
        <h1>{title}</h1><p>{subtitle}</p>
        {error && <div className="alert error">{error}</div>}
        <label>Email<input type="email" required value={form.email} onChange={e => setForm({...form,email:e.target.value})}/></label>
        <label>Password<input type="password" required value={form.password} onChange={e => setForm({...form,password:e.target.value})}/></label>
        <button className="button primary full" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
        {type === "driver" && <div className="auth-footer">New driver? <Link to="/driver/register">Create an account</Link></div>}
      </form>
    </div>
  );
}