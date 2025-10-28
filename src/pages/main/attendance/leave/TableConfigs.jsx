import { convertToISO8601 } from "../../../../utility/datetime.utility";

export const column = [
    {
        accessorKey: "employee_id",
        header: "Employee ID",
        cell: (info) => info.getValue(),
    },
    {
        accessorKey: "leave_date",
        header: "Leave Date",
        cell: (info) => convertToISO8601(info.getValue()),
    },
    {
        accessorKey: "leave_type",
        header: "Type",
        cell: (info) => info.getValue(),
    },
    {
        accessorKey: "leave_status",
        header: "Leave Status",
        cell: (info) => (
            <span className={`inline-block px-2 py-1 text-xs rounded-full 
                ${info.getValue() == "PENDING" ? "bg-gray-300 text-gray-800" : ""}
                ${info.getValue() == "ACCEPTED" ? "bg-green-100 text-green-700" : ""}
                ${info.getValue() == "REJECTED" ? "bg-red-100 text-red-700" : ""}`}>
                {info.getValue().toLowerCase()}
            </span>
        ),
    },
    {
        accessorKey: "is_paid",
        header: "Status",
        cell: (info) => (
            <span className={`inline-block px-2 py-1 text-xs rounded-full ${info.getValue()
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
                }`}>
                {info.getValue() ? "Paid" : "Unpaid"}
            </span>
        ),
    },

];