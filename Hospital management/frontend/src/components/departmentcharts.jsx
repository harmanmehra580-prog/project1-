import {
    PieChart,
    Pie,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";

const getDepartmentData = (appointments = []) => {
    const departmentMap = {};

    appointments.forEach((appointment) => {
        const departmentName = appointment.department?.name || "Unassigned";
        departmentMap[departmentName] = (departmentMap[departmentName] || 0) + 1;
    });

    return Object.entries(departmentMap).map(([name, value]) => ({
        name,
        value
    }));
};

const DepartmentChart = ({ appointments = [] }) => {
    const data = getDepartmentData(appointments);

    return (
        <div>

            <h2>Appointments by Department</h2>

            <ResponsiveContainer width="100%" height={300}>

                <PieChart>

                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#2563eb"
                        label
                    />

                    <Tooltip />

                    <Legend />

                </PieChart>

            </ResponsiveContainer>

        </div>
    );
};

export default DepartmentChart;