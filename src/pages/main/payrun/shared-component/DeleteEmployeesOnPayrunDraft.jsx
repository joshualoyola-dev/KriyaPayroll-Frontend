import { useEmployeeContext } from "../../../../contexts/EmployeeProvider";
import { useSharedRunningPayrunOperationContext } from "../../../../contexts/SharedRunningPayrunOperationProvider";
import { useToastContext } from "../../../../contexts/ToastProvider";

const DeleteEmployeesOnPayrunDraft = () => {
    const { mapEmployeeIdToEmployeeName } = useEmployeeContext();
    const {
        employeeIdsForm, setEmployeeIdsForm,
        isEditEmployeeOnDraft, setIsEditEmployeeOnDraft,
        isEditEmployeesOnDraftLoading, setIsEditEmployeesOnDraftLoading,
        deleteSelectedPayslipsFromDraft,

        payslips
    } = useSharedRunningPayrunOperationContext();
    const { addToast } = useToastContext();

    const onSubmit = async (e) => {
        if (employeeIdsForm.length === 0) {
            addToast("Select atleast one employee to proceed", "error");
        }

        e.preventDefault();
        deleteSelectedPayslipsFromDraft();
    }

    const handleSelectEmployee = (e) => {
        if (!employeeIdsForm.includes(e.target.value)) {
            setEmployeeIdsForm(prev => [...prev, e.target.value]);
        }
    }

    // employee present on the payrun draft
    const employeeIdsOnDraft = Object.keys(payslips);

    return (
        <div className="rounded-md">
            <div className="font-semibold text-sm ">Delete employee from drafts</div>
            <span className="text-xs text-gray-400">Select employees from dropdown to be removed from payrun</span>
            
            <form onSubmit={onSubmit} className="space-y-4">
                <select
                    onChange={handleSelectEmployee}
                    value=""
                    className="w-full px-3 py-2 border border-gray-300 rounded-full bg-white text-gray-700 text-sm focus:outline-none focus:border-gray-400"
                >
                    {employeeIdsOnDraft.map(employee_id => (
                        <option key={employee_id} value={employee_id} >{mapEmployeeIdToEmployeeName(employee_id)}</option>
                    ))}
                </select>

                <div className="flex justify-end gap-2 pt-2">
                    <button
                        type="button"
                        onClick={() => {
                            setEmployeeIdsForm([]);
                            setIsEditEmployeeOnDraft(false);
                        }}
                        className="px-4 py-1 text-sm text-gray-600 hover:cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isEditEmployeesOnDraftLoading}
                        className="px-4 py-1 text-sm text-white bg-teal-600 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer hover:bg-teal-700"
                    >
                        {isEditEmployeesOnDraftLoading ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </form>

            {employeeIdsForm.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                        Selected employee
                    </div>
                    <div className="flex">
                        {employeeIdsForm.map(employee_id => (
                            <div key={employee_id} className="px-2 py-1 border border-gray-500 rounded-full text-xs">
                                {mapEmployeeIdToEmployeeName(employee_id)}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeleteEmployeesOnPayrunDraft;