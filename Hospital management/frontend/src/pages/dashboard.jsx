import { useEffect, useMemo, useState } from "react";
import api from "../services/api.js";
import DepartmentChart from "../components/departmentcharts.jsx";
import AppointmentChart from "../components/appointmentcharts.jsx";
import PatientForm from "../components/patientform.jsx";
import { FiActivity, FiArrowUpRight, FiCalendar, FiDollarSign, FiUserCheck, FiUsers } from "react-icons/fi";

const Dashboard = ({ user }) => {
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [bills, setBills] = useState([]);

    const handlePatientAdded = (newPatient) => {
        setPatients((current) => [newPatient, ...current]);
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [patientsResponse, doctorsResponse, appointmentsResponse, departmentsResponse, billsResponse] = await Promise.all([
                    api.get("/patients"),
                    api.get("/doctors"),
                    api.get("/appointments"),
                    api.get("/departments"),
                    api.get("/bills")
                ]);

                setPatients(patientsResponse.data);
                setDoctors(doctorsResponse.data);
                setAppointments(appointmentsResponse.data);
                setDepartments(departmentsResponse.data);
                setBills(billsResponse.data);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            }
        };

        fetchDashboardData();
    }, []);

    const summaryCards = useMemo(() => {
        const revenue = bills.reduce((total, bill) => total + Number(bill.totalAmount || 0), 0);
        const pendingBalance = bills.reduce((total, bill) => total + Number(bill.dueAmount || 0), 0);

        return [
            { title: "Total Patients", value: patients.length, subtitle: `${patients.filter((patient) => patient.status === "Active").length} active` },
            { title: "Doctors", value: doctors.length, subtitle: `${doctors.filter((doctor) => doctor.status === "Active").length} active` },
            { title: "Appointments", value: appointments.length, subtitle: `${appointments.filter((appointment) => appointment.status === "Scheduled").length} scheduled` },
            { title: "Revenue", value: `₹${revenue.toFixed(2)}`, subtitle: `₹${pendingBalance.toFixed(2)} due` }
        ];
    }, [patients, doctors, appointments, bills]);

    const currentHour = new Date().getHours();
    const greeting = currentHour < 12 ? "Good morning" : currentHour < 18 ? "Good afternoon" : "Good evening";
    const today = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }).format(new Date());

    return (
        <div className="dashboard-page">
            <section className="welcome-banner">
                <div><p className="eyebrow">{today}</p><h2>{greeting}, {user?.name || "there"}</h2><p>Here is today&apos;s operational snapshot across your hospital.</p></div>
                <div className="welcome-accent"><FiActivity /></div>
            </section>

            <div className="stats-grid">
                {summaryCards.map((card, index) => {
                    const icons = [FiUsers, FiUserCheck, FiCalendar, FiDollarSign];
                    const Icon = icons[index];
                    return (
                    <div className="stat-card" key={card.title}>
                        <div className={`stat-icon stat-icon-${index}`}><Icon /></div>
                        <div className="stat-card-top"><span>{card.title}</span><FiArrowUpRight /></div>
                        <strong>{card.value}</strong>
                        <small>{card.subtitle}</small>
                    </div>
                    );
                })}
            </div>

            <div className="chart-grid">
                <section className="panel chart-panel"><div className="panel-heading"><div><p className="eyebrow">Activity</p><h3>Appointment volume</h3></div><span className="panel-meta">Last 6 months</span></div><AppointmentChart appointments={appointments} /></section>
                <section className="panel chart-panel"><div className="panel-heading"><div><p className="eyebrow">Distribution</p><h3>By department</h3></div><span className="panel-meta">Current period</span></div><DepartmentChart appointments={appointments} departments={departments} /></section>
            </div>
            <section className="panel form-panel"><div className="panel-heading"><div><p className="eyebrow">Patient intake</p><h3>Register a new patient</h3></div></div><PatientForm onPatientAdded={handlePatientAdded} /></section>
        </div>
    );
};

export default Dashboard;
