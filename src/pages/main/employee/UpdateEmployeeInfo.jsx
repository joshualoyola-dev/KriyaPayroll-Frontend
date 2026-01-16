import { useEmployeeContext } from "../../../contexts/EmployeeProvider";

const UpdateEmployeeInfo = () => {
    const {
        updateEmployeeInformation,
        employeeUpdateFormData,
        setEmployeeUpdateFormData,
        toggleEdit,
        isUpdating,
    } = useEmployeeContext();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await updateEmployeeInformation();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployeeUpdateFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const formatDateForInput = (dateString) => {
        if (!dateString) return "";
        return dateString.split("T")[0];
    };


    const inputClass =
        "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none";

    const labelClass = "text-sm font-medium text-gray-700";

    return (
        <form
            onSubmit={handleSubmit}
            className="mx-auto max-w-4xl space-y-6 rounded-lg border border-gray-200 bg-white p-6"
        >
            <h2 className="text-lg font-semibold text-gray-900">
                Update Employee Information
            </h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                    <label className={labelClass}>First Name</label>
                    <input
                        type="text"
                        name="first_name"
                        value={employeeUpdateFormData.first_name}
                        onChange={handleChange}
                        className={inputClass}
                        required
                    />
                </div>

                <div>
                    <label className={labelClass}>Middle Name</label>
                    <input
                        type="text"
                        name="middle_name"
                        value={employeeUpdateFormData.middle_name}
                        onChange={handleChange}
                        className={inputClass}
                    />
                </div>

                <div>
                    <label className={labelClass}>Last Name</label>
                    <input
                        type="text"
                        name="last_name"
                        value={employeeUpdateFormData.last_name}
                        onChange={handleChange}
                        className={inputClass}
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <label className={labelClass}>Personal Email</label>
                    <input
                        type="email"
                        name="personal_email"
                        value={employeeUpdateFormData.personal_email}
                        onChange={handleChange}
                        className={inputClass}
                        required
                    />
                </div>

                <div>
                    <label className={labelClass}>Work Email</label>
                    <input
                        type="email"
                        name="work_email"
                        value={employeeUpdateFormData.work_email}
                        onChange={handleChange}
                        className={inputClass}
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <label className={labelClass}>Job Title</label>
                    <input
                        type="text"
                        name="job_title"
                        value={employeeUpdateFormData.job_title}
                        onChange={handleChange}
                        className={inputClass}
                        required
                    />
                </div>

                <div>
                    <label className={labelClass}>Department</label>
                    <input
                        type="text"
                        name="department"
                        value={employeeUpdateFormData.department}
                        onChange={handleChange}
                        className={inputClass}
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                    <label className={labelClass}>Emp. Status</label>
                    <select
                        name="employement_status"
                        value={employeeUpdateFormData.employement_status}
                        onChange={(e) =>
                            setEmployeeUpdateFormData((prev) => ({
                                ...prev,
                                employement_status: e.target.value === "true",
                            }))
                        }
                        className={inputClass}
                    >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                    </select>

                </div>

                <div>
                    <label className={labelClass}>Date Hired</label>
                    <input
                        type="date"
                        name="date_hired"
                        value={formatDateForInput(employeeUpdateFormData.date_hired)}
                        onChange={handleChange}
                        className={inputClass}
                        required
                    />
                </div>

                <div>
                    <label className={labelClass}>End Date</label>
                    <input
                        type="date"
                        name="date_end"
                        value={formatDateForInput(employeeUpdateFormData.date_end)}
                        onChange={handleChange}
                        className={inputClass}
                    />
                </div>
            </div>

            <div className="flex justify-end space-x-2">
                <button
                    onClick={toggleEdit}
                    className="rounded-full bg-gray-300 text-white px-6 py-2 text-sm font-medium hover:cursor-pointer"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="rounded-full bg-teal-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-teal-700 hover:cursor-pointer disabled:opacity-50"
                    disabled={isUpdating}
                >
                    {isUpdating ? "Loading" : "Save Changes"}
                </button>
            </div>
        </form>
    );
};

export default UpdateEmployeeInfo;
