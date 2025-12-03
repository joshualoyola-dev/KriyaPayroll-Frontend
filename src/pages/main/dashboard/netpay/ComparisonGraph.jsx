import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

const ComparisonGraph = () => {
    const data = [
        { name: "Ton", sales: 4000, revenue: 2400 },
        { name: "Allen", sales: 3000, revenue: 1398 },
        { name: "June", sales: 2000, revenue: 9800 },
        { name: "Apr", sales: 2780, revenue: 3908 },
        { name: "May", sales: 1890, revenue: 4800 },
        { name: "Jun", sales: 2390, revenue: 3800 },
        { name: "Jul", sales: 3490, revenue: 4300 },
    ];

    return (
        <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                    dataKey="name"
                    stroke="#64748b"
                    style={{ fontSize: "14px" }}
                />
                <YAxis
                    stroke="#64748b"
                    style={{ fontSize: "14px" }}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #64748b",
                        borderRadius: "8px",
                        color: "#fff",
                    }}
                    cursor={{ stroke: "#cbd5e1", strokeWidth: 1 }}
                />
                <Legend
                    wrapperStyle={{ paddingTop: "20px" }}
                    iconType="line"
                />
                <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: "#3b82f6", r: 5 }}
                    activeDot={{ r: 7 }}
                    name="Sales"
                />
                <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ fill: "#10b981", r: 5 }}
                    activeDot={{ r: 7 }}
                    name="Revenue"
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default ComparisonGraph;