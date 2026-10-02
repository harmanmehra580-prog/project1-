import { useEffect, useState } from "react";
import api from "../services/api.js";

const initialForm = {
    patient: "",
    doctor: "",
    testName: "",
    testDate: "",
    result: "",
    status: "Pending"
};

const LabTests = () => {
    const [labTests, setLabTests] = useState([]);
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [form, setForm] = useState(initialForm);
    const [editingId, setEditingId] = useState("");
    const [editForm, setEditForm] = useState(initialForm);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const startEdit = (labTest) => {
        setEditingId(labTest._id);
        setEditForm({
            patient: labTest.patient?._id || "",
            doctor: labTest.doctor?._id || "",
            testName: labTest.testName || "",
            testDate: labTest.testDate ? new Date(labTest.testDate).toISOString().slice(0, 10) : "",
            result: labTest.result || "",
            status: labTest.status || "Pending"
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
            const { data } = await api.post("/labtests", form);
            setLabTests((current) => [data, ...current]);
            setForm(initialForm);
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Unable to create lab test.");
        } finally {
            setSaving(false);
        }
    };

    const handleUpdate = async (event) => {
        event.preventDefault();
        setError("");

        try {
            const { data } = await api.put(`/labtests/${editingId}`, editForm);
            setLabTests((current) => current.map((labTest) => (labTest._id === editingId ? data : labTest)));
            setEditingId("");
            setEditForm(initialForm);
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Unable to update lab test.");
        }
    };

    const handleDelete = async (labTestId) => {
        const target = labTests.find((item) => item._id === labTestId);
        if (!window.confirm(`Delete lab test ${target?.testName || "this test"}?`)) return;

        try {
            await api.delete(`/labtests/${labTestId}`);
            setLabTests((current) => current.filter((item) => item._id !== labTestId));
            if (editingId === labTestId) {
                setEditingId("");
                setEditForm(initialForm);
            }
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Unable to delete lab test.");
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [testResponse, patientResponse, doctorResponse] = await Promise.all([
                    api.get("/labtests"),
                    api.get("/patients"),
                    api.get("/doctors")
                ]);

                setLabTests(testResponse.data);
                setPatients(patientResponse.data);
                setDoctors(doctorResponse.data);
            } catch (requestError) {
                setError(requestError.response?.data?.message || "Unable to load lab tests.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <main>
            <h1>Lab Tests</h1>

            <form onSubmit={handleSubmit}>
                <h2>Book Test</h2>

                <select name="patient" value={form.patient} onChange={handleChange} required>
                    <option value="">Select patient</option>
                    {patients.map((patient) => (
                        <option key={patient._id} value={patient._id}>
                            {patient.patientId} - {patient.name}
                        </option>
                    ))}
                </select>

                <select name="doctor" value={form.doctor} onChange={handleChange}>
                    <option value="">Select doctor (optional)</option>
                    {doctors.map((doctor) => (
                        <option key={doctor._id} value={doctor._id}>
                            {doctor.doctorId} - {doctor.name}
                        </option>
                    ))}
                </select>

                <input name="testName" value={form.testName} onChange={handleChange} placeholder="Test name" required />
                <input name="testDate" type="date" value={form.testDate} onChange={handleChange} />
                <input name="result" value={form.result} onChange={handleChange} placeholder="Result" />
                <select name="status" value={form.status} onChange={handleChange}>
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                </select>

                {error && <p role="alert">{error}</p>}
                <button type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Add Lab Test"}
                </button>
            </form>

            {editingId && (
                <form onSubmit={handleUpdate}>
                    <h2>Edit Lab Test</h2>
                    <select name="patient" value={editForm.patient} onChange={handleEditChange} required>
                        <option value="">Select patient</option>
                        {patients.map((patient) => (
                            <option key={patient._id} value={patient._id}>
                                {patient.patientId} - {patient.name}
                            </option>
                        ))}
                    </select>
                    <select name="doctor" value={editForm.doctor} onChange={handleEditChange}>
                        <option value="">Select doctor (optional)</option>
                        {doctors.map((doctor) => (
                            <option key={doctor._id} value={doctor._id}>
                                {doctor.doctorId} - {doctor.name}
                            </option>
                        ))}
                    </select>
                    <input name="testName" value={editForm.testName} onChange={handleEditChange} placeholder="Test name" required />
                    <input name="testDate" type="date" value={editForm.testDate} onChange={handleEditChange} />
                    <input name="result" value={editForm.result} onChange={handleEditChange} placeholder="Result" />
                    <select name="status" value={editForm.status} onChange={handleEditChange}>
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                    </select>
                    <button type="submit">Update Lab Test</button>
                    <button type="button" onClick={() => { setEditingId(""); setEditForm(initialForm); }}>Cancel</button>
                </form>
            )}

            {loading && <p>Loading lab tests...</p>}
            {!loading && !error && labTests.length === 0 && <p>No lab tests found.</p>}

            {!loading && labTests.length > 0 && (
                <table>
                    <thead>
                        <tr>
                            <th>Patient</th>
                            <th>Doctor</th>
                            <th>Test</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {labTests.map((labTest) => (
                            <tr key={labTest._id}>
                                <td>{labTest.patient?.name || "Unknown"}</td>
                                <td>{labTest.doctor?.name || "Unknown"}</td>
                                <td>{labTest.testName}</td>
                                <td>{labTest.testDate ? new Date(labTest.testDate).toLocaleDateString() : "-"}</td>
                                <td>{labTest.status}</td>
                                <td>
                                    <button type="button" onClick={() => startEdit(labTest)}>Edit</button>
                                    <button type="button" onClick={() => handleDelete(labTest._id)} style={{ marginLeft: "8px" }}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </main>
    );
};

export default LabTests;
