import { useUploadPayrunContext } from "../../../../contexts/UploadPayrunProvider";

const ErrorModal = () => {
    const { missingEmpIds, handleClosePayrun } = useUploadPayrunContext();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-300/40">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
                <h2 className="text-lg font-semibold text-red-600 mb-4">
                    Missing Employee Records
                </h2>
                <p className="text-sm text-gray-700 mb-4">
                    The following employee IDs are missing in the records. Please insert them before you can proceed with the upload of the payrun:
                </p>
                <ul className="list-disc list-inside mb-4 max-h-48 overflow-y-auto">
                    {missingEmpIds.map((id) => (
                        <li key={id} className="text-sm text-gray-800">{id}</li>
                    ))}
                </ul>
                <div className="flex justify-end">
                    <button
                        onClick={handleClosePayrun}
                        className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ErrorModal;
