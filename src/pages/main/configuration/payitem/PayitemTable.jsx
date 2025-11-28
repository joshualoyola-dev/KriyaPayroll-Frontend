import { usePayitemContext } from "../../../../contexts/PayitemProvider";
import { toSentenceCase } from "../../../../utility/text.utility";

const PayitemTable = () => {
    const { filteredPayitems } = usePayitemContext();

    const columns = ["payitem_id", "payitem_name", "payitem_category", "payitem_type", "payitem_group"];

    return (
        <div className="overflow-x-auto overflow-y-auto max-h-full rounded-2xl w-full border-gray-200">
            <table className="min-w-full text-left text-sm text-gray-700">

                {/* Sticky header */}
                <thead className="bg-gray-200 text-gray-500 uppercase text-xs tracking-wider sticky top-0 z-10">
                    <tr>
                        {columns.map((col) => (
                            <th key={col} className="px-4 py-3 font-medium bg-gray-200">
                                {col.replace(/_/g, " ")}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody className="bg-white">
                    {filteredPayitems && filteredPayitems.length > 0 ? (
                        filteredPayitems.map((item) => (
                            <tr key={item.payitem_id} className="hover:bg-gray-50 transition">
                                {columns.map((col) => (
                                    <td key={col} className="px-4 py-3">
                                        {toSentenceCase(item[col])}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length} className="px-4 py-6 text-center text-gray-400">
                                No payitems available
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default PayitemTable;
