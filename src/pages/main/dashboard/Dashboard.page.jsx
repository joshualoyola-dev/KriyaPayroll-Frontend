import Question from "../../../components/Question";
import UnderDevelopment from "../../../components/UnderDevelopment";
import { useCompanyContext } from "../../../contexts/CompanyProvider";
import { DailyRecordsCounts } from "./daily-records/DailyRecordsCounts";
import CompareNetPay from "./netpay/CompareNetPay";


const DashboardPage = () => {
    const { company, loading, handleShowAddCompanyModal } = useCompanyContext();

    if (loading) return <div>Loading</div>

    if (!company) return <Question
        title="No Company Found"
        label="Create to start runing payroll for your organization"
        onStartFunction={handleShowAddCompanyModal}
        buttonLabel="Create Company"
    />;

    return (
        <div className="px-4 py-3">
            {/* 4 boxes in one row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-200 rounded-xl p-6 h-24"></div>
                <div className="bg-gray-200 rounded-xl p-6 h-24"></div>
                <div className="bg-gray-200 rounded-xl p-6 h-24"></div>
                <div className="bg-gray-200 rounded-xl p-6 h-24"></div>
            </div>

            <CompareNetPay />

            <DailyRecordsCounts />
        </div>
    );
}

export default DashboardPage;