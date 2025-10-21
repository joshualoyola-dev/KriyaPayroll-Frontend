// Column definitions - full table
const fullEmployeeColumns = [
    {
        accessorKey: "employee_id",
        header: "Employee ID",
        cell: (info) => info.getValue(),
    },
    {
        accessorKey: "first_name",
        header: "First Name",
        cell: (info) => info.getValue(),
    },
    {
        accessorKey: "last_name",
        header: "Last Name",
        cell: (info) => info.getValue(),
    },
    {
        accessorKey: "work_email",
        header: "Work Email",
        cell: (info) => info.getValue(),
    },
    {
        accessorKey: "job_title",
        header: "Job Title",
        cell: (info) => info.getValue(),
    },
    {
        accessorKey: "employement_status",
        header: "Status",
        cell: (info) => (
            <span className={`inline-block px-2 py-1 text-xs rounded-full ${info.getValue()
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
                }`}>
                {info.getValue() ? "Active" : "Inactive"}
            </span>
        ),
    },
    {
        accessorKey: "base_pay",
        header: "Base Pay",
        cell: (info) => {
            const value = info.getValue();
            return value ? `₱${parseFloat(value).toLocaleString()}` : 'N/A';
        },
    },
];

// Column definitions - compact table (when card is open)
const compactEmployeeColumns = [
    {
        accessorKey: "employee_id",
        header: "ID",
        cell: (info) => info.getValue(),
    },
    {
        accessorKey: "first_name",
        header: "First Name",
        cell: (info) => info.getValue(),
    },
    {
        accessorKey: "last_name",
        header: "Last Name",
        cell: (info) => info.getValue(),
    },
    {
        accessorKey: "job_title",
        header: "Job Title",
        cell: (info) => info.getValue(),
    },
    {
        accessorKey: "employement_status",
        header: "Status",
        cell: (info) => (
            <span className={`inline-block px-2 py-1 text-xs rounded-full ${info.getValue()
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
                }`}>
                {info.getValue() ? "Active" : "Inactive"}
            </span>
        ),
    },
    {
        accessorKey: "base_pay",
        header: "Base Pay",
        cell: (info) => {
            const value = info.getValue();
            return value ? `₱${parseFloat(value).toLocaleString()}` : 'N/A';
        },
    },
];

export { fullEmployeeColumns, compactEmployeeColumns };