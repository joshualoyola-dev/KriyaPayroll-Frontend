import AddModal from "../../../../components/AddModal";
import DailyRecordFilter from "../../../../components/DailyRecordFilter";
import DualBallLoading from "../../../../components/DualBallLoading";
import NoAccess from "../../../../components/NoAccess";
import TanStackTable from "../../../../components/TanStackTable"; // Added missing import
import env from "../../../../configs/env.config";
import { useEmployeeContext } from "../../../../contexts/EmployeeProvider";
import { usePayitemContext } from "../../../../contexts/PayitemProvider";
import { useRecurringPayContext } from "../../../../contexts/RecurringPayProvider";
import { userHasFeatureAccess } from "../../../../utility/access-controll.utility";
import RecurringPayForm from "./RecurringPayForm";
import { getRecurringPayColumns } from "./TableConfigs";

const RecurringPayPage = () => {
    const {
        recurringPaysLoading,
        recurringPays,
        handleRowClick,
        handleDeleteOneRecurringPay,
        showRecurringPayModal,
        handleShowRecurringPayModal,
        uploadRecurringPayFile,
        isUploading,

        //filter
        filters,
        handleResetFilter, handleFilterChange,
    } = useRecurringPayContext();
    const { mapEmployeeIdToEmployeeName } = useEmployeeContext();
    const { mapPayitemIdToPayitemName } = usePayitemContext();
    const columns = getRecurringPayColumns(mapEmployeeIdToEmployeeName, mapPayitemIdToPayitemName);


    const hasAccess = userHasFeatureAccess(env.VITE_PAYROLL_RECURRING_PAYS);
    if (!hasAccess) {
        return <NoAccess title={'Unauthorized'} label={'You are not allowed to access this resource'} />
    }

    return (
        <>
            <div className="w-full max-w-full">
                <div className="pb-4">
                    <DailyRecordFilter
                        onClickAdd={handleShowRecurringPayModal}
                        filters={filters}
                        resetFilter={handleResetFilter}
                        onChangeFilter={handleFilterChange}
                    />
                </div>
                <div className="w-full">
                    {
                        recurringPaysLoading
                            ? <DualBallLoading />
                            : <TanStackTable
                                data={recurringPays}
                                columns={columns}
                                onRowClick={handleRowClick}
                                onDelete={handleDeleteOneRecurringPay}
                            />
                    }
                </div>
            </div>

            {
                showRecurringPayModal &&
                <AddModal
                    title="Add Recurring Pay"
                    description="Recurring pay will be included in the payrun, depending on employment status."
                    onClose={handleShowRecurringPayModal}
                    uploadFile={uploadRecurringPayFile}
                    isUploading={isUploading}
                >
                    <RecurringPayForm />
                </AddModal>
            }
        </>
    );
};

export default RecurringPayPage;