import { useState } from "react";
import { FiShield, FiUserPlus } from "react-icons/fi";
import api from "../services/api.js";

function Users() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "Receptionist" });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [saving, setSaving] = useState(false);

  const updateField = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage({ type: "", text: "" });
    setSaving(true);
    try {
      const { data } = await api.post("/auth/users", form);
      setMessage({ type: "success", text: `${data.user.name} can now sign in.` });
      setForm({ name: "", email: "", password: "", role: "Receptionist" });
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Unable to create user access." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="user-access-page">
      <div className="page-intro"><div><p className="eyebrow">Administration</p><h2>Team access</h2><p>Create secure sign-in access for another member of the hospital team.</p></div><div className="user-access-icon"><FiShield /></div></div>
      <form className="panel user-form" onSubmit={handleSubmit}>
        <div className="panel-heading"><div><p className="eyebrow">New account</p><h3><FiUserPlus /> Add a team member</h3></div></div>
        <div className="user-form-grid">
          <label>Full name<input name="name" value={form.name} onChange={updateField} required /></label>
          <label>Email address<input name="email" type="email" value={form.email} onChange={updateField} required /></label>
          <label>Temporary password<input name="password" type="password" minLength="8" value={form.password} onChange={updateField} required /></label>
          <label>Role<select name="role" value={form.role} onChange={updateField}><option>Doctor</option><option>Receptionist</option><option>Patient</option></select></label>
        </div>
        {message.text && <p className={`user-message ${message.type}`} role="status">{message.text}</p>}
        <button className="primary-button" type="submit" disabled={saving}>{saving ? "Creating access..." : "Create user access"}</button>
      </form>
    </div>
  );
}

export default Users;