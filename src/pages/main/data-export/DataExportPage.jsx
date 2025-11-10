import NoAccess from "../../../components/NoAccess";
import env from "../../../configs/env.config";
import { useExportContext } from "../../../contexts/ExportProvider";
import { userHasFeatureAccess } from "../../../utility/access-controll.utility";
import YtdSection from "./YtdSection";

const DataExportPage = () => {
    const { selectedExport, handleChangeSelection } = useExportContext();

    const hasAccess = userHasFeatureAccess(env.VITE_PAYROLL_DATA_EXPORTS);
    if (!hasAccess) {
        return <NoAccess title={'Unauthorized'} label={'You are not allowed to access this resource'} />
    }

    return (
        <div className="flex flex-col">
            <div className="flex justify-end mb-3">
                <div className="flex gap-x-3 justify-center items-center">
                    <p className="text-xs text-gray-600">Data to Export: </p>
                    <select
                        className="px-3 py-1 text-sm bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-medium"
                        value={selectedExport}
                        onChange={(e) => handleChangeSelection(e.target.value)}>
                        <option value="ytd">YTD</option>
                        <option value="2316">2316</option>
                        <option value="1601c">1601c</option>
                    </select>
                </div>
            </div>
            {selectedExport === "ytd" && <YtdSection />}
        </div>
    );
};

export default DataExportPage;