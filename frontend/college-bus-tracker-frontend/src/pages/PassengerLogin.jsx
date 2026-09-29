import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BusFront, LockKeyhole, Mail } from "lucide-react";
import { api } from "../api";

export default function PassengerLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setBusy(true);
    try {
      const data = await api("/auth/passenger/login", {
        method: "POST", body: JSON.stringify(form)
      });
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", "passenger");
      localStorage.setItem("user", JSON.stringify(data.passenger));
      navigate("/passenger");
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <div className="auth-logo"><BusFront /></div>
        <span className="eyebrow">Passenger portal</span>
        <h1>Welcome back</h1>
        <p>Sign in to access your passenger account and live campus bus tracking.</p>
        {error && <div className="alert error" role="alert">{error}</div>}
        <label><Mail size={14} /> Email
          <input type="email" autoComplete="email" required value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })} />
        </label>
        <label><LockKeyhole size={14} /> Password
          <input type="password" autoComplete="current-password" required value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })} />
        </label>
        <button className="button primary full" disabled={busy}>
          {busy ? "Signing in…" : "Sign in as passenger"}
        </button>
        <div className="auth-footer">
          New passenger? <Link to="/passenger/register">Create an account</Link>
        </div>
      </form>
    </div>
  );
}
