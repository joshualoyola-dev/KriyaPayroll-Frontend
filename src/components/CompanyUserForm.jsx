import { useCompanyContext } from "../contexts/CompanyProvider";
import { useUserContext } from "../contexts/UserProvider";

const CompanyUserForm = () => {
    const {
        companyUsersForm, setCompanyUsersForm,
        addCompanyUserLoading, addCompanyUserToManageCompany,
        setIsAddCompanyUser
    } = useCompanyContext();
    const { users, mapUserIdToName } = useUserContext();

    const handleSelectUser = (e) => {
        if (!companyUsersForm.includes(e.target.value)) {
            setCompanyUsersForm(prev => [...prev, e.target.value]);
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        await addCompanyUserToManageCompany();
    }

    return (
        <div className="rounded-md">
            <div className="font-semibold text-sm ">Add Users to manage the company payroll</div>
            <span className="text-xs text-gray-400">Select the users from dropdown, and click add to add the users</span>
            <form onSubmit={onSubmit} className="space-y-4">
                <select
                    onChange={handleSelectUser}
                    value=""
                    className="w-full px-3 py-2 border border-gray-300 rounded-full bg-white text-gray-700 text-sm focus:outline-none focus:border-gray-400"
                >
                    <option value="" disabled>Select a user</option>
                    {users.map(u => (
                        <option key={u.user_id} value={u.user_id}>
                            {mapUserIdToName(u.user_id)}
                        </option>
                    ))}
                </select>

                <div className="flex justify-end gap-2 pt-2">
                    <button
                        type="button"
                        onClick={() => {
                            setCompanyUsersForm([]);
                            setIsAddCompanyUser(false);
                        }}
                        className="px-4 py-1 text-sm text-gray-600 hover:cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={addCompanyUserLoading}
                        className="px-4 py-1 text-sm text-white bg-teal-600 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {addCompanyUserLoading ? "Adding..." : "Add"}
                    </button>
                </div>
            </form>

            {companyUsersForm.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                        Selected users
                    </div>
                    <div className="flex">
                        {companyUsersForm.map(user_id => (
                            <div key={user_id} className="px-2 py-1 border border-gray-500 rounded-full text-xs">
                                {mapUserIdToName(user_id)}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default CompanyUserForm;