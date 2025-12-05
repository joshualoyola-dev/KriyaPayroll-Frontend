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
import { useEmployeeContext } from "../../../../contexts/EmployeeProvider";
import { useCompareNetPayContext } from "../../../../contexts/CompareNetPayProvider";

const ComparisonGraph = ({ netSalariesPerPayrun = {} }) => {
    const { mapEmployeeIdToEmployeeName } = useEmployeeContext();
    const { mapPayrunIdToReadableName } = useCompareNetPayContext();

    // Transform the data structure
    const transformData = () => {
        const employeeMap = new Map();

        // Iterate through each payrun
        Object.entries(netSalariesPerPayrun).forEach(([payrunId, employees]) => {
            employees.forEach(({ employee_id, net_salary }) => {
                if (!employeeMap.has(employee_id)) {
                    employeeMap.set(employee_id, {
                        name: employee_id,
                        employee_id: employee_id // Store the ID for tooltip mapping
                    });
                }
                // Add the payrun as a data point for this employee
                employeeMap.get(employee_id)[payrunId] = net_salary;
            });
        });

        return Array.from(employeeMap.values());
    };

    const data = transformData();

    // Get all unique payruns to create dynamic lines
    const payruns = data.length > 0
        ? Object.keys(data[0]).filter(key => key !== 'name' && key !== 'employee_id')
        : [];

    const colors = [
        '#609899',
        '#cd5e18',
        '#3f7c7c',
        '#b7442f',
        '#d2eaea',
        '#e06b21',
        '#2f5f63',
        '#c57fa0',
        '#71a9a9',
        '#ffb688',
        '#a6cfcf',
        '#f07c33',
        '#7a3e0b',
        '#f2c14e',
        '#4f8a8a',
        '#ff8d45',
        '#8bbcbb'
    ];


    // Custom tooltip component
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            const employeeName = mapEmployeeIdToEmployeeName(data.employee_id);

            return (
                <div
                    style={{
                        backgroundColor: "#ffffff",
                        border: "1px solid #cbd5e1",
                        borderRadius: "8px",
                        padding: "10px",
                        color: "#1e293b",
                    }}
                >
                    <p style={{ margin: "0 0 5px 0", fontWeight: "bold" }}>
                        {employeeName}
                    </p>
                    {payload.map((entry, index) => (
                        <p key={index} style={{ margin: "2px 0", color: entry.color, }}>
                            <span style={{ fontWeight: "normal", fontSize: "15px" }}>{entry.name}:</span>{" "}
                            <span style={{ fontWeight: "bold", fontSize: "18px" }}>
                                {entry.value.toLocaleString()}
                            </span>
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                    dataKey="name"
                    stroke="#64748b"
                    style={{ fontSize: "12px" }}
                    label={{ value: "Employee", position: "insideBottom", offset: -5, fontSize: "12px" }}
                />
                <YAxis
                    stroke="#64748b"
                    style={{ fontSize: "12px", }}
                    label={{ value: "Net Salary", angle: -90, position: "insideLeft", fontSize: "12px" }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#cbd5e1", strokeWidth: 0 }} />
                <Legend
                    wrapperStyle={{ paddingTop: "20px", fontSize: "14px" }}
                    iconType="line"
                />
                {payruns.map((payrun, index) => (
                    <Line
                        key={payrun}
                        type="natural"
                        dataKey={payrun}
                        stroke={colors[index % colors.length]}
                        strokeWidth={2}
                        dot={{ fill: colors[index % colors.length], r: 1 }}
                        activeDot={{ r: 0 }}
                        name={mapPayrunIdToReadableName(payrun)}
                    />
                ))}
            </LineChart>
        </ResponsiveContainer>
    );
};

export default ComparisonGraph;