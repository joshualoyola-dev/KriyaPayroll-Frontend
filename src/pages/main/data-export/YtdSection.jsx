import LoadingBackground from "../../../components/LoadingBackground";
import StartIllustration from "../../../components/Start";
import { useYtdContext } from "../../../contexts/YtdProvider";
import DataExportTable from "./Table";

const YtdSection = () => {
    const { dateRangeFormData, setDateRangeFormData, handleGenerateYTD, ytds, setYtds, handleDownload, ytdsLoading, downloadLoading } = useYtdContext();

    const handleSubmit = (e) => {
        e.preventDefault();
        handleGenerateYTD();
    };

    return (
        <div className="flex flex-col">
            {/* Top controls row */}
            <div className="flex items-end justify-between gap-4 p-3">
                {/* Date range form */}
                <form
                    onSubmit={handleSubmit}
                    className="flex items-end gap-4"
                >
                    <div className="flex flex-col">
                        <label className="mb-1 text-xs font-medium text-gray-700">From</label>
                        <input
                            value={dateRangeFormData.date_start}
                            onChange={(e) => setDateRangeFormData((prev) => ({ ...prev, date_start: e.target.value }))}
                            type="date"
                            className="w-40 rounded-full border border-gray-300 bg-white px-3 py-1 text-sm"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-1 text-xs font-medium text-gray-700">To</label>
                        <input
                            value={dateRangeFormData.date_end}
                            onChange={(e) => setDateRangeFormData((prev) => ({ ...prev, date_end: e.target.value }))}
                            type="date"
                            className="w-40 rounded-full border border-gray-300 bg-white px-3 py-1 text-sm"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-1 text-xs font-medium text-gray-700">Employees</label>
                        <select
                            value={dateRangeFormData.active_employees}
                            onChange={(e) => setDateRangeFormData((prev) => ({ ...prev, active_employees: e.target.value }))}
                            className="w-40 rounded-full border border-gray-300 bg-white px-3 py-1 text-sm"
                        >
                            <option value={0}>All employees (active & inactive)</option>
                            <option value={1}>Active employees only</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="self-end rounded-xl bg-teal-600 px-3 py-1 text-sm font-medium text-white hover:bg-teal-700"
                    >
                        Generate
                    </button>
                </form>

                {/* Actions (same as 1601c) */}
                {
                    ytds.length === 0
                        ? <></>
                        : <div className="flex flex-col">
                            <label className="mb-1 text-xs font-medium text-gray-700">Download YTD</label>
                            <button
                                onClick={handleDownload}
                                className="rounded-xl bg-orange-600 px-3 py-1 text-sm font-medium text-white hover:bg-orange-700"
                            >
                                Download
                            </button>
                            <div className="mt-2 flex gap-2">
                                <button
                                    type="button"
                                    className="rounded-xl bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700"
                                >
                                    Generate a PDF
                                </button>
                                <button
                                    type="button"
                                    className="rounded-xl bg-orange-500 px-3 py-1 text-xs font-medium text-white hover:bg-orange-600"
                                >
                                    Save as Draft
                                </button>
                            </div>
                        </div>
                }

            </div>

            {/* Data table */}
            <div>
                {ytds.length === 0
                    ? <StartIllustration title="Generate" label="Select data to generate from the selection." />
                    : <DataExportTable data={ytds} setData={setYtds} />
                }
            </div>

            {/* Loading Generate or Download  */}
            {(ytdsLoading || downloadLoading) && <LoadingBackground />}
        </div>
    );
};

export default YtdSection;
