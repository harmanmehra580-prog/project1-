import { useEffect, useMemo, useState } from "react";
import api from "../services/api.js";

const PatientDetails = ({ patientId, onBack, onBookAppointment }) => {
    const [patient, setPatient] = useState(null);
    const [prescriptions, setPrescriptions] = useState([]);
    const [labTests, setLabTests] = useState([]);
    const [bills, setBills] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(Boolean(patientId));
    const [error, setError] = useState("");

    useEffect(() => {
        if (!patientId) {
            return;
        }

        const fetchPatientData = async () => {
            setLoading(true);
            setError("");

            try {
                const [patientsResponse, prescriptionsResponse, labTestsResponse, billsResponse, appointmentsResponse] = await Promise.all([
                    api.get("/patients"),
                    api.get("/prescriptions"),
                    api.get("/labtests"),
                    api.get("/bills"),
                    api.get("/appointments")
                ]);

                const selectedPatient = patientsResponse.data.find((item) => item._id === patientId);
                if (!selectedPatient) {
                    setError("Patient not found.");
                    setLoading(false);
                    return;
                }

                setPatient(selectedPatient);
                setPrescriptions(
                    prescriptionsResponse.data.filter((item) => item.patient?._id === patientId || item.patient === patientId)
                );
                setLabTests(
                    labTestsResponse.data.filter((item) => item.patient?._id === patientId || item.patient === patientId)
                );
                setBills(
                    billsResponse.data.filter((item) => item.patient?._id === patientId || item.patient === patientId)
                );
                setAppointments(
                    appointmentsResponse.data.filter((item) => item.patient?._id === patientId || item.patient === patientId)
                );
            } catch (requestError) {
                setError(requestError.response?.data?.message || "Unable to load patient details.");
            } finally {
                setLoading(false);
            }
        };

        fetchPatientData();
    }, [patientId]);

    const summary = useMemo(() => {
        if (!patient) return [];

        return [
            { label: "Patient ID", value: patient.patientId },
            { label: "Age", value: patient.age },
            { label: "Gender", value: patient.gender },
            { label: "Blood Group", value: patient.bloodGroup || "-" },
            { label: "Status", value: patient.status },
            { label: "Phone", value: patient.phone }
        ];
    }, [patient]);

    if (!patientId) return <div><button type="button" onClick={onBack}>Back</button><p>No patient selected.</p></div>;
    if (loading) return <p>Loading patient details...</p>;
    if (error) return <div><button type="button" onClick={onBack}>Back</button><p role="alert">{error}</p></div>;
    if (!patient) return <div><button type="button" onClick={onBack}>Back</button><p>No patient selected.</p></div>;

    return (
        <div>
            <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "16px", flexWrap: "wrap" }}>
                <button type="button" onClick={onBack}>Back to Patients</button>
                <button type="button" onClick={() => onBookAppointment?.(patient._id)}>Book Appointment</button>
            </div>
            <h1>{patient.name}</h1>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px", marginBottom: "24px" }}>
                {summary.map((item) => (
                    <div key={item.label} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "12px" }}>
                        <small style={{ color: "#64748b", display: "block" }}>{item.label}</small>
                        <strong>{item.value}</strong>
                    </div>
                ))}
            </div>

            <section style={{ marginBottom: "24px" }}>
                <h2>Medical History</h2>

                <div style={{ display: "grid", gap: "16px" }}>
                    <div>
                        <h3>Appointments</h3>
                        {appointments.length === 0 ? <p>No appointments scheduled.</p> : (
                            <ul>
                                {appointments.map((item) => (
                                    <li key={item._id}>
                                        <strong>{item.doctor?.name || "Unknown doctor"}</strong> — {item.doctor?.specialization || "General care"}
                                        <div>Department: {item.department?.name || "Unassigned"}</div>
                                        <div>Date: {new Date(item.date).toLocaleDateString()} at {item.time}</div>
                                        <div>Status: {item.status}</div>
                                        {item.reason && <div>Reason: {item.reason}</div>}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div>
                        <h3>Prescriptions</h3>
                        {prescriptions.length === 0 ? <p>No prescriptions.</p> : (
                            <ul>
                                {prescriptions.map((item) => (
                                    <li key={item._id}>
                                        <strong>{item.medicine}</strong> — {item.diagnosis}
                                        <div>Doctor: {item.doctor?.name || "Unknown"}</div>
                                        <div>Dosage: {item.dosage || "-"}</div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div>
                        <h3>Lab Tests</h3>
                        {labTests.length === 0 ? <p>No lab tests.</p> : (
                            <ul>
                                {labTests.map((item) => (
                                    <li key={item._id}>
                                        <strong>{item.testName}</strong> — {item.status}
                                        <div>{item.result || "Pending result"}</div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div>
                        <h3>Billing</h3>
                        {bills.length === 0 ? <p>No bills.</p> : (
                            <ul>
                                {bills.map((item) => (
                                    <li key={item._id}>
                                        <strong>Total:</strong> ₹{Number(item.totalAmount || 0).toFixed(2)}
                                        <div>Paid: ₹{Number(item.paidAmount || 0).toFixed(2)} | Due: ₹{Number(item.dueAmount || 0).toFixed(2)}</div>
                                        <div>Status: {item.status}</div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PatientDetails;
