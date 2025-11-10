import DualBallLoading from "../../../../components/DualBallLoading";
import NoAccess from "../../../../components/NoAccess";
import env from "../../../../configs/env.config";
import { useHolidayContext } from "../../../../contexts/HolidayProvider";
import { userHasFeatureAccess } from "../../../../utility/access-controll.utility";
import AttendanceList from "./AttendanceList";
import Filter from "./Filter";
import HolidayForm from "./HolidayForm";
import HolidayList from "./HolidayList";
import HolidayModal from "./HolidayModal";
import UpdateHolidayForm from "./UpdateHolidayForm";

const HolidayPage = () => {
    const {
        handleShowAddHolidayModal,
        handleShowUpdateHolidayModal, // Added this
        showAddHoliday,
        showUpdateHoliday, // Added this
        attendancesLoading,
        attendances
    } = useHolidayContext();

    const hasAccess = userHasFeatureAccess(env.VITE_PAYROLL_DAILY_RECORDS);
    if (!hasAccess) {
        return <NoAccess title={'Unauthorized'} label={'You are not allowed to access this resource'} />
    }

    return (
        <>
            <div className="w-full max-w-full">
                {/* Top Filter */}
                <div className="pb-6">
                    <Filter onClickAdd={handleShowAddHolidayModal} />
                </div>

                {/* Main Content */}
                <div className="flex gap-6">
                    {/* Holidays List */}
                    <div className="w-1/2">
                        <div className="text-sm font-semibold text-gray-700">Holiday</div>
                        <HolidayList />
                    </div>

                    {/* Employees Attended Placeholder */}
                    <div className="w-2/3 flex flex-col">
                        <div className="text-sm font-semibold text-gray-700">Employees on Selected Holiday</div>
                        {
                            attendancesLoading
                                ? <div className="w-full p-4 flex items-center justify-center text-gray-500">
                                    <div className="flex items-center justify-center">
                                        <DualBallLoading />
                                    </div>
                                </div>
                                :
                                <>
                                    {attendances.length === 0
                                        ? <div className="w-full p-4 flex items-center justify-center text-gray-500">
                                            <p>No employees to display. Select a holiday to see attendees.</p>
                                        </div>
                                        : <AttendanceList attendances={attendances} />
                                    }
                                </>
                        }
                    </div>
                </div>
            </div>

            {/* Add Holiday Modal */}
            {showAddHoliday && (
                <HolidayModal
                    title="Add Holiday"
                    description="Fill in the details to add a new holiday"
                    onClose={handleShowAddHolidayModal}
                >
                    <HolidayForm />
                </HolidayModal>
            )}

            {/* Update Holiday Modal - Fixed: Now uses separate state */}
            {showUpdateHoliday && (
                <HolidayModal
                    title="Update Holiday"
                    description="Fill in the details to update the holiday"
                    onClose={handleShowUpdateHolidayModal} // Changed handler
                >
                    <UpdateHolidayForm />
                </HolidayModal>
            )}
        </>
    );
};

export default HolidayPage;