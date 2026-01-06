import { useEffect } from "react";
import AddModal from "../../../components/AddModal";
import LoadingBackground from "../../../components/LoadingBackground";
import NoAccess from "../../../components/NoAccess";
import Search from "../../../components/Search";
import env from "../../../configs/env.config";
import { useEmployeeContext } from "../../../contexts/EmployeeProvider";
import { userHasFeatureAccess } from "../../../utility/access-controll.utility";
import AddEmployeeForm from "./AddEmployeeForm";
import EmployeeCard from "./EmployeeCard";
import EmployeeTable from "./EmployeeTable";

const EmployeePage = () => {
    const { query, setQuery, employee, setEmployee, handleShowAddModal, showAddModal, showAddSalaryForm, setShowAddSalaryForm, handleChangeEmploymentStatus, uploadEmployeeFile, isUploading, isEmployeesLoading, isEmployeeLoading, isEditEmployee, toggleEdit, } = useEmployeeContext();

    const hasAccess = userHasFeatureAccess(env.VITE_PAYROLL_EMPLOYEE_MANAGEMENT);

    // Disable back button when employee card is open
    useEffect(() => {
        if (employee) {
            const handlePopState = (e) => {
                e.preventDefault();
                setEmployee(null);
            };

            window.addEventListener("popstate", handlePopState);
            window.history.pushState(null, "", window.location.href);

            return () => {
                window.removeEventListener("popstate", handlePopState);
            };
        }
    }, [employee, setEmployee]);

    // Disable body scroll when employee card is open
    useEffect(() => {
        if (employee || showAddModal) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }

        return () => {
            document.body.style.overflow = "unset";
        };
    }, [employee, showAddModal]);

    if (!hasAccess) {
        return (
            <NoAccess title={'Unauthorized'} label={'You are not allowed to access this resource'} />
        );
    }

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
                {
                    isEmployeesLoading
                        ? <LoadingBackground />
                        : <EmployeeTable />
                }

            </div>
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

            {/* Overlay backdrop */}
            {employee && (
                <div
                    className="fixed inset-0 bg-black/30 z-40 transition-opacity duration-300"
                    onClick={() => setEmployee(null)}
                />
            )}

            {/* Employee Card - slides in from right when opened */}
            {employee && (
                <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-end">
                    <div
                        className="pointer-events-auto transform transition-all duration-300 ease-out"
                        style={{
                            transform: employee ? 'translateX(0)' : 'translateX(100%)',
                            opacity: employee ? 1 : 0,
                        }}
                    >
                        <EmployeeCard
                            employee={employee}
                            setEmployee={setEmployee}
                            setShowAddSalaryForm={setShowAddSalaryForm}
                            showAddSalaryForm={showAddSalaryForm}
                            handleChangeEmploymentStatus={handleChangeEmploymentStatus}
                            isEditEmployee={isEditEmployee}
                            toggleEditEmployee={toggleEdit}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default EmployeePage;