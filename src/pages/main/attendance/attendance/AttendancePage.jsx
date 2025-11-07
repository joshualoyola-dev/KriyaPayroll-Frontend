import AddModal from "../../../../components/AddModal";
import DailyRecordFilter from "../../../../components/DailyRecordFilter";
import DualBallLoading from "../../../../components/DualBallLoading";
import NoAccess from "../../../../components/NoAccess";
import TanStackTable from "../../../../components/TanStackTable";
import env from "../../../../configs/env.config";
import { useAttendanceContext } from "../../../../contexts/AttendanceProvider";
import { userHasFeatureAccess } from "../../../../utility/access-controll.utility";
import AttendanceForm from "./AttendanceForm";
import { column } from "./TableConfigs";

const AttendancePage = () => {
    const { attendances, isAttendancesLoading, handleRowClick, handleShowAttendanceModal,
        showAttendanceModal, isUploading, uploadAttendanceFile, handleDeleteOneAttendance,
        filters, handleResetFilter, handleFilterChange,
        limit, setLimit } = useAttendanceContext();

    const hasAccess = userHasFeatureAccess(env.VITE_PAYROLL_DAILY_RECORDS);
    if (!hasAccess) {
        return <NoAccess title={'Unauthorized'} label={'You are not allowed to access this resource'} />
    }

    return (
        <>
            <div className="w-full max-w-full">
                <div className="pb-4">
                    <DailyRecordFilter
                        onClickAdd={handleShowAttendanceModal}
                        filters={filters}
                        onChangeFilter={handleFilterChange}
                        resetFilter={handleResetFilter}
                    />
                </div>
                <div className="w-full">
                    {
                        isAttendancesLoading
                            ? <DualBallLoading />
                            : <TanStackTable
                                data={attendances}
                                columns={column}
                                onRowClick={handleRowClick}
                                onDelete={handleDeleteOneAttendance}
                                limit={limit}
                                setLimit={setLimit}
                            />
                    }
                </div>
            </div>
            {showAttendanceModal
                && <AddModal
                    title="Add Attendance"
                    description="Attendances will be included in the payrun, depending on employment status."
                    onClose={handleShowAttendanceModal}
                    uploadFile={uploadAttendanceFile}
                    isUploading={isUploading}
                >
                    <AttendanceForm />
                </AddModal>
            }
        </>
    );
};

export default AttendancePage;