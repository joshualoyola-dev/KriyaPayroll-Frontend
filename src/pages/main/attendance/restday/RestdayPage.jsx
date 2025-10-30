import AddModal from "../../../../components/AddModal";
import DailyRecordFilter from "../../../../components/DailyRecordFilter";
import DualBallLoading from "../../../../components/DualBallLoading";
import TanStackTable from "../../../../components/TanStackTable";
import { useRestdayContext } from "../../../../contexts/RestdayProvider";
import RestdayForm from "./RestdayForm";
import { column } from "./TableConfigs";

const RestdayPage = () => {
    const {
        handleShowRestdayModal,
        restdays,
        handleRowClick,
        handleDeleteOneRestday,
        showRestdayModal,
        uploadRestdayFile,
        isUploading,

        //filter
        filters,
        handleResetFilter, handleFilterChange,

        //filter
        isRestdaysLoading,

        limit, setLimit
    } = useRestdayContext();

    return (
        <>
            <div className="w-full max-w-full">
                <div className="pb-4">
                    <DailyRecordFilter
                        onClickAdd={handleShowRestdayModal}
                        filters={filters}
                        resetFilter={handleResetFilter}
                        onChangeFilter={handleFilterChange}
                    />
                </div>
                <div className="w-full">
                    {
                        isRestdaysLoading
                            ? <DualBallLoading />
                            : <TanStackTable
                                data={restdays}
                                columns={column}
                                onRowClick={handleRowClick}
                                onDelete={handleDeleteOneRestday}
                                limit={limit}
                                setLimit={setLimit}
                            />
                    }


                </div>
            </div>
            {showRestdayModal && (
                <AddModal
                    title="Add Restday"
                    description="Restday will be included in the payrun, depending on employment status."
                    onClose={handleShowRestdayModal}
                    uploadFile={uploadRestdayFile}
                    isUploading={isUploading}
                >
                    <RestdayForm />
                </AddModal>
            )}
        </>
    );
};

export default RestdayPage;