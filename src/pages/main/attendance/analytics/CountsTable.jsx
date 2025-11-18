
export const CountsTable = ({ data, columns, payrun_days }) => {
    return (
        <div className="overflow-x-auto w-full  border-gray-200">
            <table className="min-w-full text-left text-sm text-gray-700">
                <thead className="font-medium text-gray-800 text-sm tracking-wider border-b border-t">
                    <tr>
                        {columns.map((col) => (
                            <th key={col} className="px-4 py-3 font-medium">
                                {col.replace(/_/g, " ")}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white">
                    {data && data.length > 0 ? (
                        data.map((d, idx) => {
                            const totalDays = (d.attendance || 0) + (d.absence || 0) + (d.leave || 0);
                            const isComplete = totalDays === Number(payrun_days);
                            return (
                                <tr key={idx}
                                    className={`${isComplete ? "" : "bg-red-100 hover:bg-red-200"}`} >
                                    {
                                        columns.map((col) => (
                                            <td key={col} className="px-4 py-3">
                                                {d[col]}
                                            </td>
                                        ))
                                    }
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={columns.length} className="px-4 py-6 text-center text-gray-400">
                                No data available
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div >
    );
};

export default CountsTable;