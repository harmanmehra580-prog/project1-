import { useState } from "react";
import { FiArrowRight, FiHeart, FiLock, FiMail } from "react-icons/fi";
import api from "../services/api.js";

function Login({ onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await api.post("/auth/login", form);
      localStorage.setItem("carepointToken", data.token);
      localStorage.setItem("carepointUser", JSON.stringify(data.user));
      onLogin(data.user);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to connect to the hospital system.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-shell">
      <section className="login-intro">
        <span className="login-brand-mark"><FiHeart /></span>
        <p className="eyebrow">CarePoint / Secure access</p>
        <h1>Care that stays connected.</h1>
        <p>Sign in to manage patients, appointments, billing, and clinical records from one calm workspace.</p>
      </section>
      <section className="login-panel">
        <div className="login-heading">
          <p className="eyebrow">Hospital network</p>
          <h2>Welcome back</h2>
          <p>Use your CarePoint account to continue.</p>
        </div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email address</label>
          <div className="login-input"><FiMail /><input id="email" type="email" autoComplete="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required /></div>
          <label htmlFor="password">Password</label>
          <div className="login-input"><FiLock /><input id="password" type="password" autoComplete="current-password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required /></div>
          {error && <p className="login-error" role="alert">{error}</p>}
          <button className="primary-button login-button" type="submit" disabled={loading}>{loading ? "Signing in..." : "Sign in"}<FiArrowRight /></button>
        </form>
      </section>
    </div>
  );
}

export default Login;