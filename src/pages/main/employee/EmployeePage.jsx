// export default EmployeePage;
import AddModal from "../../../components/AddModal";
import LoadingBackground from "../../../components/LoadingBackground";
import Search from "../../../components/Search";
import { useEmployeeContext } from "../../../contexts/EmployeeProvider";
import AddEmployeeForm from "./AddEmployeeForm";
import EmployeeCard from "./EmployeeCard";
import EmployeeTable from "./EmployeeTable";

const EmployeePage = () => {
    const { query, setQuery, employee, setEmployee, handleShowAddModal, showAddModal, showAddSalaryForm, setShowAddSalaryForm, handleChangeEmploymentStatus, uploadEmployeeFile, isUploading, isEmployeesLoading, isEmployeeLoading } = useEmployeeContext();

    return (
        <>
            <div>
                <div className="flex justify-between pb-4">
                    <Search query={query} setQuery={setQuery} />
                    <button
                        onClick={() => handleShowAddModal(true)}
                        className="bg-teal-600 text-sm px-3 py-1 text-white rounded-2xl cursor-pointer hover:bg-teal-700"
                    >
                        Add +
                    </button>
                </div>

                <div className="flex gap-4">
                    {
                        isEmployeesLoading
                            ? <LoadingBackground />
                            : <div className={`transition-all duration-300 ${employee ? 'w-2/3' : 'w-full'}`}>
                                {/* Table container - adjusts width based on whether card is open */}
                                <EmployeeTable isCardOpen={!!employee} />
                            </div>
                    }
                    {/* Employee Card - slides in from right when opened */}
                    {employee && (
                        <div className="w-1/3 min-w-[350px]">
                            <EmployeeCard
                                employee={employee}
                                setEmployee={setEmployee}
                                setShowAddSalaryForm={setShowAddSalaryForm}
                                showAddSalaryForm={showAddSalaryForm}
                                handleChangeEmploymentStatus={handleChangeEmploymentStatus}
                            />
                        </div>
                    )}
                </div>
            </div>
            {/* {showAddModal && <AddEmployeeModal onClose={() => handleShowAddModal(false)} />} */}
            {showAddModal
                && <AddModal
                    onClose={() => handleShowAddModal(false)}
                    title="Add Employee"
                    description="Employees added will be included in the payrun, depending on employment status."
                    uploadFile={uploadEmployeeFile}
                    isUploading={isUploading}
                >
                    <AddEmployeeForm />
                </AddModal>
            }
            {
                isEmployeeLoading && <LoadingBackground />
            }
        </>
    );
};

export default EmployeePage;