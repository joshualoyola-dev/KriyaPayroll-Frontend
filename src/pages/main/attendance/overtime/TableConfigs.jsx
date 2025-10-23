import { convertToISO8601 } from "../../../../utility/datetime.utility";

export const column = [
    {
        accessorKey: "employee_id",
        header: "Employee ID",
        cell: (info) => info.getValue(),
    },
    {
        accessorKey: "overtime_date",
        header: "Overtime Date",
        cell: (info) => convertToISO8601(info.getValue()),
    },
    {
        accessorKey: "OT Hours",
        header: "ot_hours",
        cell: (info) => info.getValue(),
    },
    {
        accessorKey: "OT Same Day",
        header: "ot_hsameday",
        cell: (info) => info.getValue(),
    },
    {
        accessorKey: "OT Next Day",
        header: "ot_hnextday",
        cell: (info) => info.getValue(),
    },
    {
        accessorKey: "nd_ot_hours",
        header: "Overtime ND",
        cell: (info) => info.getValue(),
    },
    {
        accessorKey: "ndot_hsameday",
        header: "ND OT Same day",
        cell: (info) => info.getValue(),
    },
    {
        accessorKey: "ndot_hnextday",
        header: "ND OT Next day",
        cell: (info) => info.getValue(),
    },
    {
        accessorKey: "overtime_type",
        header: "OT Type",
        cell: (info) => info.getValue(),
    },
    {
        accessorKey: "overtime_status",
        header: "Status",
        cell: (info) => (
            <span className={`inline-block px-2 py-1 text-xs rounded-full 
                ${info.getValue() == "PENDING" ? "bg-gray-300 text-gray-800" : ""}
                ${info.getValue() == "ACCEPTED" ? "bg-green-100 text-green-700" : ""}
                ${info.getValue() == "REJECTED" ? "bg-red-100 text-red-700" : ""}`}>
                {info.getValue().toLowerCase()}
            </span>
        ),
    },
];