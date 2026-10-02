import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const getAppointmentSeries = (appointments = []) => {
    const counts = Array.from({ length: 6 }, (_, index) => ({
        month: monthNames[new Date().getMonth() - (5 - index)],
        appointments: 0
    }));

    appointments.forEach((appointment) => {
        const appointmentDate = new Date(appointment.date);
        if (Number.isNaN(appointmentDate.getTime())) return;

        const currentDate = new Date();
        const monthsDiff = (currentDate.getFullYear() - appointmentDate.getFullYear()) * 12 + (currentDate.getMonth() - appointmentDate.getMonth());

        if (monthsDiff < 0 || monthsDiff > 5) return;

        const monthIndex = 5 - monthsDiff;
        counts[monthIndex].appointments += 1;
    });

    return counts;
};

const AppointmentChart = ({ appointments = [] }) => {
    const data = getAppointmentSeries(appointments);

    return (
        <div>
            <h2>Appointments by Month</h2>

            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>

                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="month" />

                    <YAxis allowDecimals={false} />

                    <Tooltip />

                    <Line
                        type="monotone"
                        dataKey="appointments"
                        stroke="#2563eb"
                        strokeWidth={2}
                    />

                </LineChart>
            </ResponsiveContainer>

        </div>
    );
};

export default AppointmentChart;