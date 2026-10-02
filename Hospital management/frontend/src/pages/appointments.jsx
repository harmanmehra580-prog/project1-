import { useEffect, useState } from "react";
import api from "../services/api.js";

const Appointments = ({ preselectedPatientId = "" }) => {
    const [appointments, setAppointments] = useState([]);
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [form, setForm] = useState({
        patient: preselectedPatientId,
        doctor: "",
        department: "",
        date: "",
        time: "",
        reason: ""
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSaving(true);

        try {
            const { data } = await api.post("/appointments", form);
            setAppointments((current) => [...current, data]);
            setForm({ patient: "", doctor: "", department: "", date: "", time: "", reason: "" });
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Unable to create appointment.");
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [appointmentResponse, patientResponse, doctorResponse, departmentResponse] =
                    await Promise.all([
                        api.get("/appointments"),
                        api.get("/patients"),
                        api.get("/doctors"),
                        api.get("/departments")
                    ]);

                setAppointments(appointmentResponse.data);
                setPatients(patientResponse.data);
                setDoctors(doctorResponse.data);
                setDepartments(departmentResponse.data);
            } catch (requestError) {
                setError(
                    requestError.response?.data?.message ||
                        "Unable to load appointment data. Add doctors and departments first."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <main>
            <h1>Appointments</h1>

            <form onSubmit={handleSubmit}>
                <h2>Schedule Appointment</h2>

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
                            {doctor.name} - {doctor.specialization}
                        </option>
                    ))}
                </select>

                <select name="department" value={form.department} onChange={handleChange} required>
                    <option value="">Select department</option>
                    {departments.map((department) => (
                        <option key={department._id} value={department._id}>
                            {department.name}
                        </option>
                    ))}
                </select>

                <input name="date" type="date" value={form.date} onChange={handleChange} required />
                <input name="time" type="time" value={form.time} onChange={handleChange} required />
                <input name="reason" value={form.reason} onChange={handleChange} placeholder="Reason" maxLength="500" />
                <button type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Schedule Appointment"}
                </button>
            </form>

            {loading && <p>Loading appointments...</p>}
            {error && <p role="alert">{error}</p>}

            {!loading && !error && appointments.length === 0 && (
                <p>No appointments found.</p>
            )}

            {!loading && !error && appointments.length > 0 && (
                <table>
                    <thead>
                        <tr>
                            <th>Patient</th>
                            <th>Doctor</th>
                            <th>Department</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map((appointment) => (
                            <tr key={appointment._id}>
                                <td>{appointment.patient?.name || "Unknown"}</td>
                                <td>{appointment.doctor?.name || "Unknown"}</td>
                                <td>{appointment.department?.name || "Unknown"}</td>
                                <td>{new Date(appointment.date).toLocaleDateString()}</td>
                                <td>{appointment.time}</td>
                                <td>
                                    <select
                                        value={appointment.status}
                                        onChange={async (event) => {
                                            const newStatus = event.target.value;
                                            try {
                                                const { data } = await api.patch(`/appointments/${appointment._id}/status`, { status: newStatus });
                                                setAppointments((current) =>
                                                    current.map((item) =>
                                                        item._id === appointment._id ? { ...item, status: data.status } : item
                                                    )
                                                );
                                            } catch (requestError) {
                                                setError(requestError.response?.data?.message || "Unable to update appointment status.");
                                            }
                                        }}
                                    >
                                        <option value="Scheduled">Scheduled</option>
                                        <option value="Confirmed">Confirmed</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </main>
    );
};

export default Appointments;
