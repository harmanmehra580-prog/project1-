import { useEffect, useState } from "react";
import api from "../services/api.js";

const initialForm = {
    doctorId: "",
    name: "",
    email: "",
    phone: "",
    specialization: "",
    department: "",
    experience: "",
    fee: "",
    status: "Active"
};

const Doctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [form, setForm] = useState(initialForm);
    const [editingId, setEditingId] = useState("");
    const [editForm, setEditForm] = useState({ status: "Active" });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
    };

    const handleEditChange = (event) => {
        const { name, value } = event.target;
        setEditForm((current) => ({ ...current, [name]: value }));
    };

    const startEdit = (doctor) => {
        setEditingId(doctor.doctorId || doctor._id);
        setEditForm({ status: doctor.status || "Active" });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSaving(true);

        try {
            const { data } = await api.post("/doctors", {
                ...form,
                experience: form.experience ? Number(form.experience) : undefined,
                fee: form.fee ? Number(form.fee) : undefined,
                department: form.department || undefined
            });
            setDoctors((current) => [...current, data].sort((left, right) =>
                left.name.localeCompare(right.name)
            ));
            setForm(initialForm);
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Unable to create doctor.");
        } finally {
            setSaving(false);
        }
    };

    const handleUpdate = async (event) => {
        event.preventDefault();
        setError("");
        setSaving(true);

        try {
            const { data } = await api.put(`/doctors/${editingId}`, editForm);

            setDoctors((current) => current.map((doctor) => (
                doctor._id === data._id || doctor.doctorId === data.doctorId ? data : doctor
            )).sort((left, right) => left.name.localeCompare(right.name)));
            setEditingId("");
            setEditForm({ status: "Active" });
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Unable to update doctor status.");
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [doctorResponse, departmentResponse] = await Promise.all([
                    api.get("/doctors"),
                    api.get("/departments")
                ]);
                setDoctors(doctorResponse.data);
                setDepartments(departmentResponse.data);
            } catch (requestError) {
                setError(
                    requestError.response?.data?.message ||
                        "Unable to load doctors and departments."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <main>
            <h1>Doctors</h1>

            <form onSubmit={handleSubmit}>
                <h2>Add Doctor</h2>
                <input name="doctorId" value={form.doctorId} onChange={handleChange} placeholder="Doctor ID (e.g. D-001)" required />
                <input name="name" value={form.name} onChange={handleChange} placeholder="Full name" required />
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" required />
                <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" required />
                <input name="specialization" value={form.specialization} onChange={handleChange} placeholder="Specialization" required />
                <select name="department" value={form.department} onChange={handleChange}>
                    <option value="">Select department</option>
                    {departments.map((department) => (
                        <option key={department._id} value={department._id}>
                            {department.name}
                        </option>
                    ))}
                </select>
                <input name="experience" type="number" min="0" value={form.experience} onChange={handleChange} placeholder="Experience in years" />
                <input name="fee" type="number" min="0" value={form.fee} onChange={handleChange} placeholder="Consultation fee" />
                <select name="status" value={form.status} onChange={handleChange}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </select>
                {error && <p role="alert">{error}</p>}
                <button type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Add Doctor"}
                </button>
            </form>

            {editingId && (
                <form onSubmit={handleUpdate}>
                    <h2>Update Doctor Status</h2>
                    <select name="status" value={editForm.status} onChange={handleEditChange}>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                    <button type="submit" disabled={saving}>
                        {saving ? "Updating..." : "Save Status"}
                    </button>
                    <button type="button" onClick={() => { setEditingId(""); setEditForm({ status: "Active" }); }}>
                        Cancel
                    </button>
                </form>
            )}

            {loading && <p>Loading doctors...</p>}
            {!loading && !error && doctors.length === 0 && <p>No doctors found.</p>}

            {!loading && doctors.length > 0 && (
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Specialization</th>
                            <th>Department</th>
                            <th>Phone</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {doctors.map((doctor) => (
                            <tr key={doctor._id}>
                                <td>{doctor.doctorId}</td>
                                <td>{doctor.name}</td>
                                <td>{doctor.specialization}</td>
                                <td>{doctor.department?.name || "Not assigned"}</td>
                                <td>{doctor.phone}</td>
                                <td>{doctor.status}</td>
                                <td>
                                    <button type="button" onClick={() => startEdit(doctor)}>
                                        Change Status
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </main>
    );
};

export default Doctors;
