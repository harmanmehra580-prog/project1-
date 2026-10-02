import { useState } from "react";
import Dashboard from "./pages/dashboard.jsx";
import Patients from "./pages/paitents.jsx";
import Appointments from "./pages/appointments.jsx";
import Doctors from "./pages/doctors.jsx";
import Billing from "./pages/billing.jsx";
import Prescriptions from "./pages/prescriptions.jsx";
import LabTests from "./pages/labtests.jsx";
import PatientDetails from "./pages/patientdetails.jsx";
import Login from "./pages/login.jsx";
import Users from "./pages/users.jsx";
import AdminProfile from "./pages/adminprofile.jsx";
import {
  FiActivity,
  FiClipboard,
  FiCreditCard,
  FiGrid,
  FiHeart,
  FiMenu,
  FiPlus,
  FiLogOut,
  FiUser,
  FiUserCheck,
  FiUsers,
  FiX
} from "react-icons/fi";

const navigation = [
  { id: "dashboard", label: "Overview", icon: FiGrid },
  { id: "patients", label: "Patients", icon: FiUsers },
  { id: "doctors", label: "Doctors", icon: FiUserCheck },
  { id: "billing", label: "Billing", icon: FiCreditCard },
  { id: "prescriptions", label: "Prescriptions", icon: FiClipboard },
  { id: "labtests", label: "Lab Tests", icon: FiActivity },
  { id: "users", label: "Team Access", icon: FiUserCheck, adminOnly: true },
  { id: "profile", label: "Admin Profile", icon: FiUser }
];

function App() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("carepointUser")) || null;
    } catch {
      return null;
    }
  });
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [appointmentPrefillPatientId, setAppointmentPrefillPatientId] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const changeTab = (tab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  const openPatientDetails = (patientId) => {
    setSelectedPatientId(patientId);
    changeTab("patientdetail");
  };

  const openAppointmentBooking = (patientId = "") => {
    setAppointmentPrefillPatientId(patientId);
    setSelectedPatientId(patientId);
    changeTab("patients");
  };

  const activeLabel = navigation.find((item) => item.id === activeTab)?.label || "Patient details";

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  const logout = () => {
    localStorage.removeItem("carepointToken");
    localStorage.removeItem("carepointUser");
    setUser(null);
  };

  const openAdminProfile = () => changeTab("profile");

  return (
    <div className="app-shell">
      <button className="mobile-menu-button" type="button" aria-label="Open navigation" onClick={() => setSidebarOpen(true)}>
        <FiMenu />
      </button>
      {sidebarOpen && <button className="sidebar-backdrop" type="button" aria-label="Close navigation" onClick={() => setSidebarOpen(false)} />}

      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <span className="brand-mark"><FiHeart /></span>
          <span><strong>CarePoint</strong><small>Hospital network</small></span>
          <button className="sidebar-close" type="button" aria-label="Close navigation" onClick={() => setSidebarOpen(false)}><FiX /></button>
        </div>

        <p className="nav-label">Workspace</p>
        <nav className="main-nav" aria-label="Main navigation">
          {navigation.filter((item) => !item.adminOnly || user.role === "Admin").map(({ id, label, icon: Icon }) => (
            <button className={activeTab === id ? "nav-item active" : "nav-item"} key={id} type="button" onClick={() => changeTab(id)}>
              <Icon />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="status-dot" />
          <div><strong>System online</strong><span>All services operational</span></div>
          <button className="logout-button" type="button" aria-label="Log out" title="Log out" onClick={logout}><FiLogOut /></button>
        </div>
      </aside>

      <div className="app-content">
        <header className="topbar">
          <div><p className="eyebrow">CarePoint / {activeLabel}</p><h1>{activeLabel}</h1></div>
          <div className="topbar-actions">
            <span className="date-chip"><FiActivity /> Clinical operations</span>
            <button className="primary-button compact-button" type="button" onClick={() => changeTab("patients")}><FiPlus /> Add patient</button>
            <button className="topbar-logout" type="button" onClick={logout}><FiLogOut /> Log out</button>
            <button className="profile-avatar" type="button" aria-label="Open admin profile" title="Admin profile" onClick={openAdminProfile}>CA</button>
          </div>
        </header>

        <main className="page-content">
          {activeTab === "dashboard" && <Dashboard user={user} />}
          {activeTab === "patients" && (
            <Patients
              onOpenPatient={openPatientDetails}
              preselectedAppointmentPatientId={appointmentPrefillPatientId}
            />
          )}
          {activeTab === "doctors" && <Doctors />}
          {activeTab === "appointments" && (
            <Appointments key={appointmentPrefillPatientId || "new-appointment"} preselectedPatientId={appointmentPrefillPatientId} />
          )}
          {activeTab === "billing" && <Billing />}
          {activeTab === "prescriptions" && <Prescriptions />}
          {activeTab === "labtests" && <LabTests />}
          {activeTab === "users" && user.role === "Admin" && <Users />}
          {activeTab === "profile" && <AdminProfile user={user} onLogout={logout} />}
          {activeTab === "patientdetail" && (
            <PatientDetails
              patientId={selectedPatientId}
              onBack={() => changeTab("patients")}
              onBookAppointment={openAppointmentBooking}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
