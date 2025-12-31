import Question from "../../../components/Question";
import UnderDevelopment from "../../../components/UnderDevelopment";
import { useCompanyContext } from "../../../contexts/CompanyProvider";
import { DailyRecordsCounts } from "./daily-records/DailyRecordsCounts";
import EmployeeWithNoLastPayRecord from "./last-pay/EmployeeWithNoLastPayRecord";
import CompareNetPay from "./netpay/CompareNetPay";

const DashboardPage = () => {
    const { company, loading, handleShowAddCompanyModal } = useCompanyContext();

    if (loading) return <div>Loading</div>;
    if (!company)
        return (
            <Question
                title="No Company Found"
                label="Create to start running payroll for your organization"
                onStartFunction={handleShowAddCompanyModal}
                buttonLabel="Create Company"
            />
        );

    return (
        <div className="px-4 py-3">
            {/* Row of 3 equal-height components */}
            <div className="flex space-x-4">
                <div className="flex-1 bg-gray-200 rounded-xl p-6 max-h-96 overflow-y-auto">

                </div>
                <div className="flex-1 bg-gray-200 rounded-xl p-6 max-h-96 overflow-y-auto">

                </div>
                <EmployeeWithNoLastPayRecord className="flex-1 max-h-96" />
            </div>

            <div className="mt-6">
                <CompareNetPay />
                <DailyRecordsCounts />
            </div>
        </div>
    );
};

export default DashboardPage;
