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
                            <option value={false}>All employees (active & inactive)</option>
                            <option value={true}>Active employees only</option>
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-1 text-xs font-medium text-gray-700">Export method</label>
                        <select
                            value={dateRangeFormData.payrun_payment_or_period}
                            onChange={(e) => setDateRangeFormData((prev) => ({ ...prev, payrun_payment_or_period: e.target.value }))}
                            className="w-40 rounded-full border border-gray-300 bg-white px-3 py-1 text-sm"
                        >
                            <option value={`PAYMENT`}>Payment </option>
                            <option value={`PERIOD`}>Payrun Period</option>
                        </select>
                    </div>


                    <div className="flex flex-col">
                        <label className="mb-1 text-xs font-medium text-gray-700">Payrun Status</label>
                        <select
                            value={dateRangeFormData.payrun_status}
                            onChange={(e) => setDateRangeFormData((prev) => ({ ...prev, payrun_status: [e.target.value] }))}
                            className="w-40 rounded-full border border-gray-300 bg-white px-3 py-1 text-sm"
                        >
                            <option value={`APPROVED`}>Approved </option>
                            <option value={`DRAFT`}>Draft</option>
                            <option value={`FOR_APPROVAL`}>For approval</option>
                            <option value={`REJECTED`}>Rejected</option>

                        </select>
                    </div>


                    <button
                        type="submit"
                        className="self-end rounded-xl bg-teal-600 px-3 py-1 text-sm font-medium text-white hover:bg-teal-700"
                    >
                        Generate
                    </button>
                </form>

                {/* Download button */}
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
