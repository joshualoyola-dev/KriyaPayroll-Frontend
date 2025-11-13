

const PayrunLogs = ({ logs }) => {
    return (
        <div className="absolute top-1 left-4 z-50 w-sm bg-white border border-gray-300 rounded-xl shadow-lg overflow-hidden">
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
                        {/* Name and Action in a row */}
                        <div className="flex items-center space-x-4">
                            {/* Reduced width for name */}
                            <p className="text-gray-800 text-sm font-medium flex-shrink-0 w-1/3 truncate">
                                {log.name}
                            </p>
                            {/* Action takes remaining space */}
                            <span className="text-xs text-gray-600 flex-1">{log.action}</span>
                        </div>
                        {/* Timestamp */}
                        <p className="text-gray-400 text-xs mt-1">{log.created_at}</p>
                    </div>
                ))
            )}
        </div>
    );
};

export default PayrunLogs;
