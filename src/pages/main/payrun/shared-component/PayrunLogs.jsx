import { useUserContext } from "../../../../contexts/UserProvider";

const PayrunLogs = ({ logs }) => {
    const { mapUserIdToName } = useUserContext();

    return (
        <div className="px-3 py-1 absolute top-1 left-4 z-50 w-sm bg-white border border-gray-300 rounded-lg overflow-hidden max-h-96 shadow-lg overflow-y-auto">
            <h1 className="text-xs font-semibold text-start pb-1">Payrun Logs</h1>
            {logs.length === 0 ? (
                <div className="p-6 text-gray-400 text-sm text-center">
                    No logs
                </div>
            ) : (
                logs.map((log, index) => (
                    <div
                        key={index}
                        className="px-4 py-2 border-b last:border-b-0 border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex items-center space-x-4">
                            <p className="text-gray-800 text-sm font-medium flex-shrink-0 w-1/3 truncate">
                                {mapUserIdToName(log.performed_by)}
                            </p>
                            <span className="text-xs text-gray-600 flex-1">
                                {log.action}
                            </span>
                        </div>
                        <p className="text-gray-400 text-xs mt-1"> {new Date(log.created_at).toLocaleString()}</p>
                    </div>
                ))
            )}
        </div>
    );
};


export default PayrunLogs;