import { useCompanyContext } from "../contexts/CompanyProvider";
import { useUserContext } from "../contexts/UserProvider";
import Input from "./Input.component";
import { XMarkIcon, ChevronDownIcon } from "@heroicons/react/24/solid";


const CompanyForm = () => {
    const {
        companyFormData,
        setCompanyFormData,
        setIsAddCompanyModalOpen,
        handleCreateCompany,
        isAddCompanyLoading,
        addEditor,
        removeUser
    } = useCompanyContext();

    const {
        users, user, isUsersLoading
    } = useUserContext();


    const handleChange = (e) => {
        setCompanyFormData({
            ...companyFormData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <form onSubmit={handleCreateCompany}>
            <div className="grid grid-cols-3 gap-4">
                <Input
                    label="Company ID"
                    name="company_id"
                    value={companyFormData.company_id}
                    onChange={handleChange}
                    required
                />
                <Input
                    label="Company Name"
                    name="company_name"
                    value={companyFormData.company_name}
                    onChange={handleChange}
                    required
                />
                <Input
                    label="Company Trade Name"
                    name="company_trade_name"
                    value={companyFormData.company_trade_name}
                    onChange={handleChange}
                    required
                />
                <Input
                    label="Company email"
                    name="company_email"
                    value={companyFormData.company_email}
                    onChange={handleChange}
                    required
                />
                <Input
                    label="Company Logo"
                    name="company_logo"
                    value={companyFormData.company_logo}
                    onChange={handleChange}
                    required
                />
                <Input
                    label="Company Address"
                    name="company_address"
                    value={companyFormData.company_address}
                    onChange={handleChange}
                    required
                />
                <Input
                    label="Company Phone"
                    name="company_phone"
                    value={companyFormData.company_phone}
                    onChange={handleChange}
                    required
                />
                <Input
                    label="Company TIN"
                    name="company_tin"
                    value={companyFormData.company_tin}
                    onChange={handleChange}
                    required
                />

                <div className="mb-4">
                    <label className="blcok text-sm font-medium">Company Business Type</label>
                    <select
                        className="w-full px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                        name="business_type"
                        value={companyFormData.business_type}
                        onChange={handleChange}
                        required
                    >
                        {['SOLE_PROPRIETORSHIP', 'PARTNERSHIP', 'LIMITED_LIABILITY_COMPANY', 'CORPORATION', 'COOPERATIVE', 'NON_PROFIT_ORGANIZATION'].map(item => (
                            <option value={item}>{item.replaceAll('_', ' ').toLocaleLowerCase()}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* users Selection */}
            {!isUsersLoading && (
                <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700">
                        Select following  users to manage company's payroll
                    </label>
                    <p className="text-xs text-gray-500 mb-3">
                        The selected users is responsible for managing the company's payroll, and their access is defined in the company's HRIS.
                    </p>

                    <div className="relative">
                        <select
                            value=""
                            className="w-full rounded-lg border-gray-300 text-sm px-3 py-2 pr-8 appearance-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            onChange={(e) => {
                                const selectedUser = users.find(
                                    (u) => u.user_id.toString() === e.target.value
                                );
                                if (selectedUser) addEditor(selectedUser);
                            }}
                        >
                            <option value="">-- Select Users --</option>
                            {users.map((u) => {
                                if (u.user_id == user.user_id) return;

                                return (<option key={u.user_id} value={u.user_id}>
                                    {u.first_name} {u.last_name}
                                </option>)
                            })}
                        </select>
                        <ChevronDownIcon className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                        {companyFormData.editors.map((a) => (
                            <div
                                key={a.user_id}
                                className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-sm text-gray-700"
                            >
                                {`${a.first_name} ${a.last_name}`}
                                <button
                                    type="button"
                                    className="text-gray-400 hover:text-red-500 transition"
                                    onClick={() => removeUser("editors", a.user_id)}
                                >
                                    <XMarkIcon className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Buttons */}
            <div className="flex justify-end gap-4 mt-6">
                <button
                    type="button"
                    onClick={() => setIsAddCompanyModalOpen(false)}
                    className="rounded-full border border-gray-400 px-6 hover:bg-gray-100"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="rounded-full px-6 bg-teal-600 text-white"
                >
                    {isAddCompanyLoading ? "Loading..." : "Create"}
                </button>
            </div>
        </form>
    );
};

export default CompanyForm;
