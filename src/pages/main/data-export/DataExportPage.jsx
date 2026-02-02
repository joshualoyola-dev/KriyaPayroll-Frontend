import NoAccess from "../../../components/NoAccess";
import env from "../../../configs/env.config";
import { useExportContext } from "../../../contexts/ExportProvider";
import { userHasFeatureAccess } from "../../../utility/access-controll.utility";
import YtdSection from "./YtdSection";
import Section2316 from "./Section2316";
import Section1601c from "./Section1601c";

const DataExportPage = () => {
    const { selectedExport, handleChangeSelection } = useExportContext();

    const hasAccess = userHasFeatureAccess(env.VITE_PAYROLL_DATA_EXPORTS);
    if (!hasAccess) {
        return <NoAccess title={'Unauthorized'} label={'You are not allowed to access this resource'} />
    }

    const getTabClasses = (value) => {
        const isActive = selectedExport === value;
        return [
            "flex-1 rounded-full px-4 py-2 text-sm font-medium border",
            "transition-colors duration-150",
            isActive
                ? "bg-teal-600 text-white border-teal-600 shadow-sm"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50",
        ].join(" ");
    };

    return (
        <div className="flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <div className="flex-1 max-w-xl mx-auto">
                    <div className="flex bg-gray-100 rounded-full p-1 border border-gray-200">
                        <button
                            type="button"
                            className={getTabClasses("ytd")}
                            onClick={() => handleChangeSelection("ytd")}
                        >
                            Year to Date
                        </button>
                        <button
                            type="button"
                            className={getTabClasses("2316")}
                            onClick={() => handleChangeSelection("2316")}
                        >
                            2316
                        </button>
                        <button
                            type="button"
                            className={getTabClasses("1601c")}
                            onClick={() => handleChangeSelection("1601c")}
                        >
                            1601C
                        </button>
                    </div>
                </div>
            </div>
            {selectedExport === "ytd" && <YtdSection />}
            {selectedExport === "2316" && <Section2316 />}
            {selectedExport === "1601c" && <Section1601c />}
        </div>
    );
};

export default DataExportPage;