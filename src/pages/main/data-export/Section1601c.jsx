import LoadingBackground from "../../../components/LoadingBackground";
import StartIllustration from "../../../components/Start";
import FixedHeaderTable from "./FixedHeaderTable";
import use1601c from "../../../hooks/use1601c"; // Adjust path as needed

const Section1601c = () => {
    const {
        formData, setFormData,
        rows,
        generateLoading,
        downloadLoading,
        columns,
        lockedKeys,
        handleGenerate,
        handleDownload,
        handleChangeCell
    } = use1601c();

    return (
        <div className="flex flex-col">
            <div className="flex items-end justify-between gap-4 p-3">
                <form onSubmit={handleGenerate} className="flex items-end gap-4">
                    <div className="flex flex-col">
                        <label className="mb-1 text-xs font-medium text-gray-700">From</label>
                        <input
                            value={formData.date_start}
                            onChange={(e) => setFormData((prev) => ({ ...prev, date_start: e.target.value }))}
                            type="date"
                            className="w-40 rounded-full border border-gray-300 bg-white px-3 py-1 text-sm"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-1 text-xs font-medium text-gray-700">To</label>
                        <input
                            value={formData.date_end}
                            onChange={(e) => setFormData((prev) => ({ ...prev, date_end: e.target.value }))}
                            type="date"
                            className="w-40 rounded-full border border-gray-300 bg-white px-3 py-1 text-sm"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-1 text-xs font-medium text-gray-700">Employees</label>
                        <select
                            value={formData.active_employees}
                            onChange={(e) => setFormData((prev) => ({ ...prev, active_employees: e.target.value }))}
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

                {rows.length > 0 && (
                    <div className="flex flex-col">
                        <label className="mb-1 text-xs font-medium text-gray-700">Download 1601c</label>
                        <button
                            onClick={handleDownload}
                            className="rounded-xl bg-orange-700 px-3 py-1 text-sm font-medium text-white hover:bg-orange-800"
                        >
                            Download
                        </button>

                        <div className="mt-2 flex gap-2">
                            <button type="button" className="rounded-xl bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700">
                                Generate a PDF
                            </button>
                            <button type="button" className="rounded-xl bg-orange-500 px-3 py-1 text-xs font-medium text-white hover:bg-orange-600">
                                Save as Draft
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div>
                {rows.length === 0 ? (
                    <StartIllustration title="Generate" label="Select data to generate from the selection." />
                ) : (
                    <FixedHeaderTable
                        columns={columns}
                        rows={rows}
                        onChangeCell={handleChangeCell}
                        lockedKeys={lockedKeys}
                    />
                )}
            </div>

            {(generateLoading || downloadLoading) && <LoadingBackground />}
        </div>
    );
};

export default Section1601c;