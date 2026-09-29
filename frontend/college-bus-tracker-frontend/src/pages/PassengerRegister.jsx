import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BusFront } from "lucide-react";
import { api } from "../api";

const initial = { name: "", email: "", phone: "", studentId: "", college: "", password: "", confirmPassword: "" };

export default function PassengerRegister() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const update = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    setError("");
    if (form.password.length < 8) return setError("Password must be at least 8 characters");
    if (form.password !== form.confirmPassword) return setError("Passwords do not match");
    setBusy(true);
    try {
      const { confirmPassword, ...payload } = form;
      await api("/auth/passenger/register", { method: "POST", body: JSON.stringify(payload) });
      navigate("/passenger/login", { state: { registered: true } });
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  };

  return (
    <div className="auth-page">
      <form className="auth-card wide" onSubmit={submit}>
        <div className="auth-logo"><BusFront /></div>
        <span className="eyebrow">Passenger portal</span>
        <h1>Create passenger account</h1>
        <p>Use your student details to create secure access to the campus bus system.</p>
        {error && <div className="alert error" role="alert">{error}</div>}
        <div className="form-row">
          <label>Full name<input name="name" autoComplete="name" required value={form.name} onChange={update} /></label>
          <label>Student ID<input name="studentId" required value={form.studentId} onChange={update} placeholder="e.g. CS2026001" /></label>
        </div>
        <div className="form-row">
          <label>Email<input name="email" type="email" autoComplete="email" required value={form.email} onChange={update} /></label>
          <label>Phone<input name="phone" type="tel" autoComplete="tel" required value={form.phone} onChange={update} /></label>
        </div>
        <label>College / Institute (optional)<input name="college" value={form.college} onChange={update} /></label>
        <div className="form-row">
          <label>Password<input name="password" type="password" minLength="8" autoComplete="new-password" required value={form.password} onChange={update} /></label>
          <label>Confirm password<input name="confirmPassword" type="password" autoComplete="new-password" required value={form.confirmPassword} onChange={update} /></label>
        </div>
        <button className="button primary full" disabled={busy}>{busy ? "Creating account…" : "Create passenger account"}</button>
        <div className="auth-footer">Already registered? <Link to="/passenger/login">Sign in</Link></div>
      </form>
    </div>
  );
}
