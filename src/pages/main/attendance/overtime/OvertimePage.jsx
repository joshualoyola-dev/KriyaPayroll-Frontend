import AddModal from "../../../../components/AddModal";
import DailyRecordFilter from "../../../../components/DailyRecordFilter";
import DualBallLoading from "../../../../components/DualBallLoading";
import TanStackTable from "../../../../components/TanStackTable";
import { useOvertimeContext } from "../../../../contexts/OvertimeProvider";
import OvertimeForm from "./OvertimeForm";
import { column } from "./TableConfigs";

const OvertimePage = () => {
    const { handleShowOvertimeModal, overtimes, handleRowClick,
        handleDeleteOneOvertime, showOvertimeModal, uploadOvertimeFile,
        isUploading,
        //filter
        filters,
        handleResetFilter, handleFilterChange,
        isOvertimesLoading,
        limit, setLimit
    } = useOvertimeContext();
    return (

        <>
            <div className="w-full max-w-full">
                <div className="pb-4">
                    <DailyRecordFilter
                        onClickAdd={handleShowOvertimeModal}
                        filters={filters}
                        resetFilter={handleResetFilter}
                        onChangeFilter={handleFilterChange}
                    />
                </div>
                <div className="w-full">
                    {
                        isOvertimesLoading
                            ? <DualBallLoading />
                            : <TanStackTable
                                data={overtimes}
                                columns={column}
                                onRowClick={handleRowClick}
                                onDelete={handleDeleteOneOvertime}
                                limit={limit}
                                setLimit={setLimit}
                            />
                    }
                </div>
            </div>
            {showOvertimeModal
                && <AddModal
                    title="Add Overtime"
                    description="Overtime will be included in the payrun, depending on employment status."
                    onClose={handleShowOvertimeModal}
                    uploadFile={uploadOvertimeFile}
                    isUploading={isUploading}
                >
                    <OvertimeForm />
                </AddModal>
            }
        </>
    );
};

export default OvertimePage;