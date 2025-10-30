import AddModal from "../../../../components/AddModal";
import DailyRecordFilter from "../../../../components/DailyRecordFilter";
import DualBallLoading from "../../../../components/DualBallLoading";
import TanStackTable from "../../../../components/TanStackTable";
import { useAbsenceContext } from "../../../../contexts/AbsenceProvider";
import AbsenceForm from "./AbsenceForm";
import { column } from "./TableConfigs";

const AbsencePage = () => {
    const {
        handleShowAbsenceModal,
        absences,
        handleRowClick,
        handleDeleteAbsence,
        showAbsenceModal,
        uploadAbsenceFile,
        isUploading,
        filters,
        handleResetFilter, handleFilterChange,
        isAbsencesLoading,
        limit, setLimit
    } = useAbsenceContext();

    return (
        <>
            <div className="w-full max-w-full">
                <div className="pb-4">
                    <DailyRecordFilter
                        onClickAdd={handleShowAbsenceModal}
                        filters={filters}
                        onChangeFilter={handleFilterChange}
                        resetFilter={handleResetFilter}
                    />
                </div>
                <div className="w-full">
                    {
                        isAbsencesLoading
                            ? <DualBallLoading />
                            : <TanStackTable
                                data={absences}
                                columns={column}
                                onRowClick={handleRowClick}
                                onDelete={handleDeleteAbsence}
                                limit={limit}
                                setLimit={setLimit}
                            />
                    }
                </div>
            </div>
            {showAbsenceModal && (
                <AddModal
                    title="Add Absences"
                    description="Absences will be included in the payrun, depending on employment status."
                    onClose={handleShowAbsenceModal}
                    uploadFile={uploadAbsenceFile}
                    isUploading={isUploading}
                >
                    <AbsenceForm />
                </AddModal>
            )}
        </>
    );
};

export default AbsencePage;