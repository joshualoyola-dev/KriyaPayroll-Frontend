import AddModal from "../../../../components/AddModal";
import DailyRecordFilter from "../../../../components/DailyRecordFilter";
import DualBallLoading from "../../../../components/DualBallLoading";
import NoAccess from "../../../../components/NoAccess";
import TanStackTable from "../../../../components/TanStackTable";
import env from "../../../../configs/env.config";
import { useLeaveContext } from "../../../../contexts/LeaveProvider";
import { userHasFeatureAccess } from "../../../../utility/access-controll.utility";
import LeaveForm from "./LeaveForm";
import { column } from "./TableConfigs";

const LeavePage = () => {
    const {
        handleShowLeaveModal,
        leaves,
        handleRowClick,
        handleDeleteOneLeave,
        showLeaveModal,
        uploadLeaveFile,
        isUploading,
        filters,
        handleResetFilter, handleFilterChange,
        isLeavesLoading, limit, setLimit
    } = useLeaveContext();

    const hasAccess = userHasFeatureAccess(env.VITE_PAYROLL_DAILY_RECORDS);
    if (!hasAccess) {
        return <NoAccess title={'Unauthorized'} label={'You are not allowed to access this resource'} />
    }

    return (
        <>
            <div className="w-full max-w-full">
                <div className="pb-4">
                    <DailyRecordFilter
                        onClickAdd={handleShowLeaveModal}
                        filters={filters}
                        onChangeFilter={handleFilterChange}
                        resetFilter={handleResetFilter}
                    />
                </div>
                <div className="w-full">
                    {
                        isLeavesLoading
                            ? <DualBallLoading />
                            : <TanStackTable
                                data={leaves}
                                columns={column}
                                onRowClick={handleRowClick}
                                onDelete={handleDeleteOneLeave}
                                limit={limit}
                                setLimit={setLimit}
                            />
                    }

                </div>
            </div>
            {showLeaveModal && (
                <AddModal
                    title="Add Leave"
                    description="Leave will be included in the payrun, depending on employment status."
                    onClose={handleShowLeaveModal}
                    uploadFile={uploadLeaveFile}
                    isUploading={isUploading}
                >
                    <LeaveForm />
                </AddModal>
            )}
        </>
    );
};

export default LeavePage;