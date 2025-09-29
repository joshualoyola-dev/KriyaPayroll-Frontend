import { convertToISO8601 } from "../../../../utility/datetime.utility";

const PayrunCard = ({ payrun, idx, oncClickCard }) => {
    return (
        <div
            onClick={() => oncClickCard(payrun.payrun_id)}
            key={idx}
            className="flex items-center justify-between p-4 rounded-2xl border border-gray-200 bg-white transition-colors hover:bg-gray-50 hover:cursor-pointer"
        >
            {/* Left section: main details */}
            <div className="flex flex-col">
                <h3 className="text-sm font-medium text-gray-700">
                    {payrun.payrun_title}
                </h3>
                <p className="text-sm text-gray-500">
                    Period: {convertToISO8601(payrun.payrun_start_date)} →{" "}
                    {convertToISO8601(payrun.payrun_end_date)}
                </p>
            </div>

            {/* Middle section: status */}
            <div className="flex flex-col items-center">
                <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${payrun.status === "Approved"
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : payrun.status === "Pending"
                            ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                        }`}
                >
                    {payrun.status}
                </span>
                <p className="text-xs text-gray-400 mt-1">
                    Updated {convertToISO8601(payrun.updated_at)}
                </p>
            </div>

            {/* Right section: payment date */}
            <div className="text-right">
                <p className="text-sm text-gray-500">Payment date</p>
                <p className="text-base font-medium text-gray-700">
                    {convertToISO8601(payrun.payment_date)}
                </p>
                <p className="text-xs text-gray-400">
                    Created {convertToISO8601(payrun.created_at)}
                </p>
            </div>
        </div>
    );
};

export default PayrunCard;
