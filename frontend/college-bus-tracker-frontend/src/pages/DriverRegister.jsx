import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BusFront } from "lucide-react";
import { api } from "../api";

export default function DriverRegister() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name:"", email:"", phone:"", password:"" });
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const update = e => setForm({...form, [e.target.name]: e.target.value});
  const submit = async e => {
    e.preventDefault();
    try {
      setError("");
      await api("/auth/driver/register", { method:"POST", body:JSON.stringify(form) });
      setDone(true);
      setTimeout(() => navigate("/driver/login"), 1300);
    } catch(e) { setError(e.message); }
  };

  return <div className="auth-page">
    <form className="auth-card" onSubmit={submit}>
      <div className="auth-logo"><BusFront/></div>
      <h1>Driver registration</h1>
      <p>Register first. An admin must approve your account before login.</p>
      {error && <div className="alert error">{error}</div>}
      {done && <div className="alert success">Registration successful. Redirecting to login…</div>}
      <label>Full name<input name="name" required value={form.name} onChange={update}/></label>
      <label>Email<input name="email" type="email" required value={form.email} onChange={update}/></label>
      <label>Phone<input name="phone" required value={form.phone} onChange={update}/></label>
      <label>Password<input name="password" type="password" minLength="8" required value={form.password} onChange={update}/></label>
      <button className="button primary full">Register</button>
      <div className="auth-footer">Already registered? <Link to="/driver/login">Sign in</Link></div>
    </form>
  </div>;
}