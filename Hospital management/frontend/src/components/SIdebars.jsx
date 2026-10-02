import {
    FaUserInjured,
    FaUserMd,
    FaCalendarAlt,
    FaBuilding,
    FaPrescriptionBottleAlt,
    FaFileInvoiceDollar,
    FaChartBar,
    FaUsers,
    FaSignOutAlt
} from "react-icons/fa";

const Sidebar = () => {
    return (
        <aside className="w-64 min-h-screen bg-blue-950 text-white p-5">

            <h1 className="text-2xl font-bold mb-8">
                🏥 HOSPITAL
            </h1>

            <nav className="space-y-3">

                <div>🏠 Dashboard</div>

                <div>
                    <FaUserInjured />
                    Patients
                </div>

                <div>
                    <FaUserMd />
                    Doctors
                </div>

                <div>
                    <FaCalendarAlt />
                    Appointments
                </div>

                <div>
                    <FaBuilding />
                    Departments
                </div>

                <div>
                    <FaPrescriptionBottleAlt />
                    Prescriptions
                </div>

                <div>
                    Lab Tests
                </div>

                <div>
                    <FaFileInvoiceDollar />
                    Billing
                </div>

                <div>
                    Payments
                </div>

                <div>
                    <FaChartBar />
                    Reports
                </div>

                <div>
                    <FaUsers />
                    Users
                </div>

                <div>
                    Settings
                </div>

            </nav>

            <div className="mt-10">
                <FaSignOutAlt />
                Logout
            </div>

        </aside>
    );
};

export default Sidebar;
