import { useEffect, useMemo, useState } from "react";
import api from "../services/api.js";
import PatientForm from "../components/patientform.jsx";
import Appointments from "./appointments.jsx";

const Patients = ({ onOpenPatient, preselectedAppointmentPatientId = "" }) => {
    const [patients, setPatients] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const handlePatientAdded = (patient) => {
        setPatients((current) => [patient, ...current]);
    };

    const handleDelete = async (patient) => {
        const confirmed = window.confirm(`Delete ${patient.name}?`);
        if (!confirmed) return;

        try {
            await api.delete(`/patients/${patient._id}`);
            setPatients((current) =>
                current.filter((currentPatient) => currentPatient._id !== patient._id)
            );
        } catch (requestError) {
            setError(
                requestError.response?.data?.message ||
                    "Unable to delete the patient."
            );
        }
    };

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const { data } = await api.get("/patients");
                setPatients(data);
            } catch (requestError) {
                setError(requestError.response?.data?.message || "Unable to load patients.");
            } finally {
                setLoading(false);
            }
        };

        fetchPatients();
    }, []);

    const filteredPatients = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return patients;

        return patients.filter((patient) =>
            [patient.patientId, patient.name, patient.phone, patient.status]
                .filter(Boolean)
                .some((value) => String(value).toLowerCase().includes(query))
        );
    }, [patients, search]);

    return (
        <div>

            <h1>Patients</h1>

            <PatientForm onPatientAdded={handlePatientAdded} />

            <section style={{ margin: "24px 0" }}>
                <Appointments
                    key={preselectedAppointmentPatientId || "new-appointment"}
                    preselectedPatientId={preselectedAppointmentPatientId}
                />
            </section>

            <input
                type="text"
                placeholder="Search Patient"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Search patients"
            />

            {loading && <p>Loading patients…</p>}
            {error && <p role="alert">{error}</p>}

            {!loading && !error && <table>

                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Age</th>
                        <th>Gender</th>
                        <th>Phone</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {filteredPatients.length === 0 ? (
                        <tr><td colSpan="7">No patients found.</td></tr>
                    ) : filteredPatients.map((patient) => (
                        <tr key={patient._id}>
                            <td>{patient.patientId}</td>
                            <td>
                                <button
                                  type="button"
                                  onClick={() => onOpenPatient?.(patient._id)}
                                  style={{ background: "none", border: "none", color: "#2563eb", cursor: "pointer", padding: 0 }}
                                >
                                    {patient.name}
                                </button>
                            </td>
                            <td>{patient.age}</td>
                            <td>{patient.gender}</td>
                            <td>{patient.phone}</td>
                            <td>{patient.status}</td>
                            <td>
                                <button type="button" onClick={() => onOpenPatient?.(patient._id)}>
                                    View
                                </button>
                                <button type="button" onClick={() => handleDelete(patient)} style={{ marginLeft: "8px" }}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>

            </table>}

        </div>
    );
};

export default Patients;
