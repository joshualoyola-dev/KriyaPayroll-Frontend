import EditCompanyForm from "./EditCompanyForm";
import EditCompanyInfoForm from "./EditCompanyInfoForm";
import { useCompanyContext } from "../contexts/CompanyProvider";
import { PencilIcon, XCircleIcon } from "@heroicons/react/16/solid";
import { useUserContext } from "../contexts/UserProvider";
import CompanyUserForm from "./CompanyUserForm";
import { useToastContext } from "../contexts/ToastProvider";
import { userHasFeatureAccess } from "../utility/access-controll.utility";
import env from "../configs/env.config";
import { PlusIcon } from "@heroicons/react/24/solid";
import { PlusCircleIcon } from "@heroicons/react/20/solid";

const EditCompanyModal = () => {
    const {
        isEditCompany,
        setIsEditCompany,
        setIsEditCompanyInfo,
        isEditCompanyInfo,
        company,
        setIsEditCompanyModalOpen,
        companyUsers,
        companyUsersLoading,
        deleteUserAccessOnCompany,
        deleteCompanyUsersLoading,
        isAddCompanyUser, setIsAddCompanyUser
    } = useCompanyContext();

    const { mapUserIdToName } = useUserContext();
    const { addToast } = useToastContext();

    const hasCompanyInfoManagementAccess = userHasFeatureAccess(env.VITE_PAYROLL_COMPANY_INFO_MANAGEMENT);
    const hasUserManagementOnCompanyUserAccess = userHasFeatureAccess(env.VITE_PAYROLL_USER_MANAGEMENT_ON_COMPANY_PAYROLL);


    const handleDeleteUser = (userId, managementId, userName) => {
        // check if the user trying to delete is the one login
        if (userId === localStorage.getItem('system_user_id')) {
            addToast("Critical error to delete oneself from system", "error");
            return;
        }

        const confirmed = window.confirm(
            `Are you sure you want to remove ${userName} from ${company.company_name}?`
        );

        if (!confirmed) return;

        deleteUserAccessOnCompany(userId, managementId);
    };


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800/30 px-4">
            <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
                {/* Close Button */}
                <button
                    onClick={() => {
                        setIsEditCompany(false);
                        setIsEditCompanyInfo(false);
                        setIsEditCompanyModalOpen(false);
                    }}
                    className="absolute right-4 top-4 text-gray-400 hover:text-red-500 transition"
                >
                    <XCircleIcon className="w-6 h-6" />
                </button>

                {/* Header */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Company Information
                    </h2>
                    <p className="text-sm text-gray-500">
                        Displayed in payslips and records.
                    </p>
                </div>

                {/* Company Main Info */}
                <div className="space-y-8">
                    <div className="relative">
                        {!isEditCompany ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm items-start">
                                {/* Company Logo */}
                                <div className="flex items-center space-x-3 sm:col-span-2">
                                    {company.company_logo ? (
                                        <img
                                            src={company.company_logo}
                                            alt="Company Logo"
                                            className="h-12 w-12 rounded-full object-cover border border-gray-200"
                                        />
                                    ) : (
                                        <div className="h-12 w-12 rounded-full bg-teal-600 flex items-center justify-center text-white font-medium">
                                            {company.company_name?.charAt(0) || "C"}
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-base font-medium text-gray-800">
                                            {company.company_name || "—"}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {company.company_trade_name || "No trade name"}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {company.company_id || "No company id"}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {company.company_email || "No company email"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <EditCompanyForm />
                        )}

                        {(!isEditCompany && hasCompanyInfoManagementAccess) && (
                            <button
                                onClick={() => setIsEditCompany(true)}
                                className="absolute top-2 right-2 text-gray-400 hover:text-teal-600 transition"
                            >
                                <PencilIcon className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-200"></div>

                    {/* Company Extra Info */}
                    <div className="relative">
                        {!isEditCompanyInfo ? (
                            <>
                                <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
                                    <div>
                                        <span className="font-medium text-gray-700">Address:</span>{" "}
                                        <span className="text-gray-600">
                                            {company.company_address || "—"}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-700">Phone:</span>{" "}
                                        <span className="text-gray-600">
                                            {company.company_phone || "—"}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-700">TIN:</span>{" "}
                                        <span className="text-gray-600">
                                            {company.company_tin || "—"}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-700">
                                            Business Type:
                                        </span>{" "}
                                        <span className="text-gray-600">
                                            {company.business_type || "—"}
                                        </span>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <EditCompanyInfoForm />
                        )}

                        {(!isEditCompanyInfo && hasCompanyInfoManagementAccess) && (
                            <button
                                onClick={() => setIsEditCompanyInfo(true)}
                                className="absolute top-2 right-2 text-gray-400 hover:text-teal-600 transition"
                            >
                                <PencilIcon className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    <div className="border-t border-gray-200"></div>

                    <div className="relative">

                        {!isAddCompanyUser
                            ?

                            <>
                                {/* Header */}
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-sm font-semibold text-gray-800">
                                        Company Users
                                    </h3>
                                </div>

                                {/* Description */}
                                <p className="text-xs text-gray-500 mb-3">
                                    Users listed below have permission to manage payroll and related records for <span className="font-medium text-gray-700">{company.company_name}</span>.
                                </p>

                                {/* Users List */}
                                {companyUsersLoading ? (
                                    <div className="text-sm text-gray-500">Loading users...</div>
                                ) : companyUsers?.length === 0 ? (
                                    <div className="text-sm text-gray-500 italic">
                                        No users are currently assigned to this company.
                                    </div>
                                ) : (
                                    <div className="grid gap-2 sm:grid-cols-2">
                                        {!deleteCompanyUsersLoading
                                            ? companyUsers.map((u) => (
                                                <div
                                                    key={u.user_id}
                                                    className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm hover:bg-gray-100 transition"
                                                >
                                                    <span className="text-gray-700 font-medium">
                                                        {mapUserIdToName(u.user_id)}
                                                    </span>
                                                    {hasUserManagementOnCompanyUserAccess &&
                                                        <button
                                                            deleteCompanyUsersLoading disabled={deleteCompanyUsersLoading}
                                                            onClick={() =>
                                                                handleDeleteUser(
                                                                    u.user_id,
                                                                    u.management_id,
                                                                    mapUserIdToName(u.user_id)
                                                                )
                                                            }                                                >
                                                            <XCircleIcon className="w-4 h-4 text-gray-400 hover:text-red-600" />
                                                        </button>}
                                                </div>
                                            ))
                                            : (
                                                <div className="flex justify-center items-center py-4 col-span-full">
                                                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-gray-700" />
                                                </div>
                                            )
                                        }
                                    </div>
                                )}
                            </>
                            : <CompanyUserForm />
                        }

                        {(!isAddCompanyUser && hasUserManagementOnCompanyUserAccess) && (
                            <button
                                onClick={() => setIsAddCompanyUser(true)}
                                className="absolute top-2 right-2 text-gray-400 hover:text-teal-600 transition"
                            >
                                <PlusCircleIcon className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditCompanyModal;
