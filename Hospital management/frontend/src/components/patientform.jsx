import { useState } from "react";
import api from "../services/api.js";

const initialForm = {
  patientId: "",
  name: "",
  age: "",
  gender: "",
  phone: "",
  email: "",
  address: "",
  bloodGroup: "",
  status: "Active",
};

export default function PatientForm({ onPatientAdded }) {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSaving(true);

    try {
      const { data } = await api.post("/patients", {
        ...form,
        age: Number(form.age),
      });

      onPatientAdded(data);
      setForm(initialForm);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Unable to create the patient."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Patient</h2>

      <input
        name="patientId"
        value={form.patientId}
        onChange={handleChange}
        placeholder="Patient ID (e.g. P-001)"
        required
      />

      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Full name"
        required
      />

      <input
        name="age"
        type="number"
        min="0"
        value={form.age}
        onChange={handleChange}
        placeholder="Age"
        required
      />

      <select
        name="gender"
        value={form.gender}
        onChange={handleChange}
        required
      >
        <option value="">Select gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>

      <input
        name="phone"
        value={form.phone}
        onChange={handleChange}
        placeholder="Phone number"
        required
      />

      <input
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email address"
      />

      <input
        name="address"
        value={form.address}
        onChange={handleChange}
        placeholder="Address"
      />

      <select
        name="bloodGroup"
        value={form.bloodGroup}
        onChange={handleChange}
      >
        <option value="">Select blood group</option>
        <option value="A+">A+</option>
        <option value="A-">A-</option>
        <option value="B+">B+</option>
        <option value="B-">B-</option>
        <option value="AB+">AB+</option>
        <option value="AB-">AB-</option>
        <option value="O+">O+</option>
        <option value="O-">O-</option>
      </select>

      {error && <p role="alert">{error}</p>}

      <button type="submit" disabled={saving}>
        {saving ? "Saving..." : "Add Patient"}
      </button>
    </form>
  );
}