import { useEffect, useState } from "react";
import api from "../services/api.js";

const initialForm = {
    patient: "",
    doctor: "",
    diagnosis: "",
    medicine: "",
    dosage: "",
    duration: "",
    instructions: ""
};

const Prescriptions = () => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [form, setForm] = useState(initialForm);
    const [editingId, setEditingId] = useState("");
    const [editForm, setEditForm] = useState(initialForm);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const startEdit = (prescription) => {
        setEditingId(prescription._id);
        setEditForm({
            patient: prescription.patient?._id || "",
            doctor: prescription.doctor?._id || "",
            diagnosis: prescription.diagnosis || "",
            medicine: prescription.medicine || "",
            dosage: prescription.dosage || "",
            duration: prescription.duration || "",
            instructions: prescription.instructions || ""
        });
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
    };

    const handleEditChange = (event) => {
        const { name, value } = event.target;
        setEditForm((current) => ({ ...current, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSaving(true);

        try {
            const { data } = await api.post("/prescriptions", form);
            setPrescriptions((current) => [data, ...current]);
            setForm(initialForm);
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Unable to create prescription.");
        } finally {
            setSaving(false);
        }
    };

    const handleUpdate = async (event) => {
        event.preventDefault();
        setError("");

        try {
            const { data } = await api.put(`/prescriptions/${editingId}`, editForm);
            setPrescriptions((current) => current.map((prescription) => (prescription._id === editingId ? data : prescription)));
            setEditingId("");
            setEditForm(initialForm);
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Unable to update prescription.");
        }
    };

    const handleDelete = async (prescriptionId) => {
        const target = prescriptions.find((item) => item._id === prescriptionId);
        if (!window.confirm(`Delete prescription for ${target?.patient?.name || "this patient"}?`)) return;

        try {
            await api.delete(`/prescriptions/${prescriptionId}`);
            setPrescriptions((current) => current.filter((item) => item._id !== prescriptionId));
            if (editingId === prescriptionId) {
                setEditingId("");
                setEditForm(initialForm);
            }
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Unable to delete prescription.");
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [prescriptionResponse, patientResponse, doctorResponse] = await Promise.all([
                    api.get("/prescriptions"),
                    api.get("/patients"),
                    api.get("/doctors")
                ]);

                setPrescriptions(prescriptionResponse.data);
                setPatients(patientResponse.data);
                setDoctors(doctorResponse.data);
            } catch (requestError) {
                setError(requestError.response?.data?.message || "Unable to load prescriptions.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <main>
            <h1>Prescriptions</h1>

            <form onSubmit={handleSubmit}>
                <h2>New Prescription</h2>

                <select name="patient" value={form.patient} onChange={handleChange} required>
                    <option value="">Select patient</option>
                    {patients.map((patient) => (
                        <option key={patient._id} value={patient._id}>
                            {patient.patientId} - {patient.name}
                        </option>
                    ))}
                </select>

                <select name="doctor" value={form.doctor} onChange={handleChange} required>
                    <option value="">Select doctor</option>
                    {doctors.map((doctor) => (
                        <option key={doctor._id} value={doctor._id}>
                            {doctor.doctorId} - {doctor.name}
                        </option>
                    ))}
                </select>

                <input name="diagnosis" value={form.diagnosis} onChange={handleChange} placeholder="Diagnosis" required />
                <input name="medicine" value={form.medicine} onChange={handleChange} placeholder="Medicine" required />
                <input name="dosage" value={form.dosage} onChange={handleChange} placeholder="Dosage" />
                <input name="duration" value={form.duration} onChange={handleChange} placeholder="Duration" />
                <textarea name="instructions" value={form.instructions} onChange={handleChange} placeholder="Instructions" rows="3" />

                {error && <p role="alert">{error}</p>}
                <button type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Save Prescription"}
                </button>
            </form>

            {editingId && (
                <form onSubmit={handleUpdate}>
                    <h2>Edit Prescription</h2>
                    <select name="patient" value={editForm.patient} onChange={handleEditChange} required>
                        <option value="">Select patient</option>
                        {patients.map((patient) => (
                            <option key={patient._id} value={patient._id}>
                                {patient.patientId} - {patient.name}
                            </option>
                        ))}
                    </select>
                    <select name="doctor" value={editForm.doctor} onChange={handleEditChange} required>
                        <option value="">Select doctor</option>
                        {doctors.map((doctor) => (
                            <option key={doctor._id} value={doctor._id}>
                                {doctor.doctorId} - {doctor.name}
                            </option>
                        ))}
                    </select>
                    <input name="diagnosis" value={editForm.diagnosis} onChange={handleEditChange} placeholder="Diagnosis" required />
                    <input name="medicine" value={editForm.medicine} onChange={handleEditChange} placeholder="Medicine" required />
                    <input name="dosage" value={editForm.dosage} onChange={handleEditChange} placeholder="Dosage" />
                    <input name="duration" value={editForm.duration} onChange={handleEditChange} placeholder="Duration" />
                    <textarea name="instructions" value={editForm.instructions} onChange={handleEditChange} placeholder="Instructions" rows="3" />
                    <button type="submit">Update Prescription</button>
                    <button type="button" onClick={() => { setEditingId(""); setEditForm(initialForm); }}>Cancel</button>
                </form>
            )}

            {loading && <p>Loading prescriptions...</p>}
            {!loading && !error && prescriptions.length === 0 && <p>No prescriptions found.</p>}

            {!loading && prescriptions.length > 0 && (
                <table>
                    <thead>
                        <tr>
                            <th>Patient</th>
                            <th>Doctor</th>
                            <th>Diagnosis</th>
                            <th>Medicine</th>
                            <th>Dosage</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {prescriptions.map((prescription) => (
                            <tr key={prescription._id}>
                                <td>{prescription.patient?.name || "Unknown"}</td>
                                <td>{prescription.doctor?.name || "Unknown"}</td>
                                <td>{prescription.diagnosis}</td>
                                <td>{prescription.medicine}</td>
                                <td>{prescription.dosage || "-"}</td>
                                <td>
                                    <button type="button" onClick={() => startEdit(prescription)}>Edit</button>
                                    <button type="button" onClick={() => handleDelete(prescription._id)} style={{ marginLeft: "8px" }}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </main>
    );
};

export default Prescriptions;
