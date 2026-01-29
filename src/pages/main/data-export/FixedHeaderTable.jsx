const FixedHeaderTable = ({ columns, rows, onChangeCell, lockedKeys = new Set() }) => {
    return (
        <div className="overflow-x-auto max-h-screen">
            <table className="min-w-full border border-gray-300 text-xs">
                <thead className="bg-gray-100 sticky top-0 z-20">
                    <tr>
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                className="border border-gray-300 px-3 py-2 text-left font-medium whitespace-nowrap"
                            >
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, rowIdx) => (
                        <tr key={rowIdx} className="odd:bg-white even:bg-gray-50">
                            {columns.map((col) => {
                                const value = row[col.key] ?? "";
                                const locked = lockedKeys.has(col.key);

                                return (
                                    <td key={col.key} className="border border-gray-300 px-2 py-1">
                                        {locked ? (
                                            <div className="text-right font-semibold text-gray-700 whitespace-nowrap">
                                                {value}
                                            </div>
                                        ) : (
                                            <input
                                                className="w-full border border-gray-200 rounded px-2 py-1 text-right text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                                                value={value}
                                                onChange={(e) => onChangeCell(rowIdx, col.key, e.target.value)}
                                            />
                                        )}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default FixedHeaderTable;

