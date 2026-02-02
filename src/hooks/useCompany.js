import { useEffect, useState, useCallback } from "react";
import {
    createCompany,
    createCompanyNDRate,
    createCompanyPayrollFrequency,
    createCompanyRegularOTRate,
    createCompanyRestdayRate,
    createCompanyWorkingDays,
    createUserToManageCompany,
    fetchCompanyNDRate,
    fetchCompanyPayrollFrequency,
    fetchCompanyRegularOTRate,
    fetchCompanyRestdayRate,
    fetchCompanyWorkingDays,
    getCompaniesService,
    getCompanyFullDetail,
    updateCompany,
    updateCompanyInfo,
} from "../services/company.service";
import { useToastContext } from "../contexts/ToastProvider";
import { useAuthContext } from "../contexts/AuthProvider";
import { useLocation } from "react-router-dom";

const initialFormData = {
    company_id: "",
    company_name: "",
    company_trade_name: "",
    company_email: "",
    company_logo: "",

    company_address: "",
    company_phone: "",
    company_tin: "",
    business_type: "",

    editors: [],
    approvers: [],
};

const convertToStringIds = (editors, approvers) => {
    const editorIds = editors.map((e) => e.user_id);
    const approverIds = approvers.map((a) => a.user_id);
    return [...editorIds, ...approverIds].join(",");
};

const useCompany = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [companies, setCompanies] = useState([]);
    const [company, setCompany] = useState(null);
    const [companyFullDetail, setCompanyFullDetail] = useState();
    const [isCompanyFullDetailLoading, setIsCompanyFullDetailLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isAddCompanyModalOpen, setIsAddCompanyModalOpen] = useState(false);
    const [isAddCompanyLoading, setIsAddCompanyLoading] = useState(false);
    const [companyFormData, setCompanyFormData] = useState(initialFormData);
    const [companyUpdateFormData, setCompanyUpdateFormData] = useState(initialFormData);
    const [isEditCompanyModalOpen, setIsEditCompanyModalOpen] = useState(false);
    const [isEditCompany, setIsEditCompany] = useState(false);
    const [isEditCompanyInfo, setIsEditCompanyInfo] = useState(false);
    const [isEditCompanyLoading, setIsEditCompanyLoading] = useState(false);
    const [isEditCompanyInfoLoading, setIsEditCompanyInfoLoading] = useState(false);

    //configurations
    const [workingDays, setWorkingDays] = useState();
    const [payrollFrequency, setPayrollFrequency] = useState();
    const [ndRate, setNdRate] = useState();
    const [regularOTRate, setRegularOTRate] = useState();
    const [restdayRate, setRestdayRate] = useState();

    const { addToast } = useToastContext();
    const { token } = useAuthContext();
    const location = useLocation();

    const fetchCompanies = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getCompaniesService();
            const fetchedCompanies = response?.data?.companies ?? [];
            setCompanies(fetchedCompanies);

            // Get last selected company_id from localStorage
            const savedCompanyId = localStorage.getItem("selected_company_id");

            let selected = null;
            if (savedCompanyId) {
                selected = fetchedCompanies.find(
                    (c) => c.company_id === savedCompanyId
                );
            }

            // fallback: if no saved company OR not found in fetched list
            if (!selected && fetchedCompanies.length > 0) {
                selected = fetchedCompanies[0];
            }

            setCompany(selected ?? null);
        } catch (error) {
            console.error("Failed to fetch companies:", error);
            setCompanies([]);
            setCompany(null);
        } finally {
            setLoading(false);
        }
    }, []);


    useEffect(() => {
        if (!token) return;
        fetchCompanies();
    }, [fetchCompanies]);

    useEffect(() => {
        if (company) {
            setCompanyUpdateFormData({
                company_id: company.company_id,
                company_name: company.company_name,
                company_trade_name: company.company_trade_name,
                company_email: company.company_email,
                company_logo: company.company_logo,

                company_address: company.company_address,
                company_phone: company.company_phone,
                company_tin: company.company_tin,
                business_type: company.business_type,
            });
        }
    }, [company]);

    const handleFetchCompanyPayrunConfigurations = useCallback(async () => {
        //fetch company configurations
        try {
            const result1 = await fetchCompanyWorkingDays(company.company_id);
            const result2 = await fetchCompanyPayrollFrequency(company.company_id);
            const result3 = await fetchCompanyNDRate(company.company_id);
            const result4 = await fetchCompanyRegularOTRate(company.company_id);
            const result5 = await fetchCompanyRestdayRate(company.company_id);

            setWorkingDays(result1.data.number_of_days);
            setPayrollFrequency(result2.data.frequency);
            setNdRate(result3.data.nd_rate);
            setRegularOTRate(result4.data.regular_ot_rate);
            setRestdayRate(result5.data.restday_rate);
        } catch (error) {
            console.log(error);
            addToast("Failed to fetch company configurations", "error");
        }
    }, []);

    useEffect(() => {
        if (!company) return;
        if (location.pathname !== '/configuration/company-configuration') return;
        handleFetchCompanyPayrunConfigurations();

    }, [company, location.pathname, handleFetchCompanyPayrunConfigurations]);

    const handleFetchCompanyFullDetail = useCallback(async () => {
        if (!company) return;
        setIsCompanyFullDetailLoading(true);
        try {
            const result = await getCompanyFullDetail(company.company_id);
            setCompanyFullDetail(result.data.company);
        } catch (error) {
            console.log(error);
            addToast("Failed to fetch company's full detail", "error")
        } finally {
            setIsCompanyFullDetailLoading(false);
        }
    }, []);

    //get companies full detail
    useEffect(() => {
        if (!company) {
            setCompanyFullDetail(null);
            return;
        };
        handleFetchCompanyFullDetail(company.company_id);
    }, [company, handleFetchCompanyFullDetail]);

    const changeSelectedCompany = useCallback((selected) => {
        setCompany(selected);
        localStorage.setItem("selected_company_id", selected?.company_id || "");
        setDropdownOpen(false);
    }, []);

    const handleShowAddCompanyModal = () => {
        setIsAddCompanyModalOpen(true);
        setDropdownOpen(false);
    }


    const handleCreateCompany = useCallback(
        async (e) => {
            e.preventDefault();

            if (
                companyFormData.approvers.length === 0 ||
                companyFormData.editors.length === 0
            ) {
                addToast("Select approvers/editors from the selection", "warning");
                return;
            }

            setIsAddCompanyLoading(true);

            try {
                // 1. Create company
                await createCompany(companyFormData);

                // 2. Assign managers
                let userIds = convertToStringIds(
                    companyFormData.editors,
                    companyFormData.approvers
                );
                userIds = `${userIds},${localStorage.getItem("system_user_id")}`;
                await createUserToManageCompany(userIds, companyFormData.company_id);

                // 3. Add default company configurations
                await createCompanyPayrollFrequency(companyFormData.company_id, 2);

                await createCompanyWorkingDays(companyFormData.company_id, 22);

                await createCompanyNDRate(companyFormData.company_id, 0.10);
                await createCompanyRegularOTRate(companyFormData.company_id, 1.25);
                await createCompanyRestdayRate(companyFormData.company_id, 1.30);

                // 4. Construct new company
                const newCompany = {
                    company_id: companyFormData.company_id,
                    company_name: companyFormData.company_name,
                    company_trade_name: companyFormData.company_trade_name,
                    company_email: companyFormData.company_email,
                    company_logo: companyFormData.company_logo,
                };

                setCompanies((prev) => [...prev, newCompany]);
                setCompany(newCompany);
                setIsAddCompanyModalOpen(false);

                addToast("New Company Created", "success");
            } catch (error) {
                console.error("Company creation failed:", error);
                const message =
                    error?.response?.data?.message || "Failed to create company.";
                addToast(message, "error");
            } finally {
                setIsAddCompanyLoading(false);
            }
        },
        [companyFormData, addToast]
    );

    // add user to editors
    const addEditor = useCallback((user) => {
        if (!companyFormData.editors.some((u) => u.user_id === user.user_id)) {
            setCompanyFormData({
                ...companyFormData,
                editors: [...companyFormData.editors, user],
            });
        }
    }, [companyFormData]);

    // add user to approvers
    const addApprover = useCallback((user) => {
        if (!companyFormData.approvers.some((u) => u.user_id === user.user_id)) {
            setCompanyFormData({
                ...companyFormData,
                approvers: [...companyFormData.approvers, user],
            });
        }
    }, [companyFormData]);

    // remove user from editors/approvers
    const removeUser = useCallback((type, id) => {
        setCompanyFormData({
            ...companyFormData,
            [type]: companyFormData[type].filter((u) => u.user_id !== id),
        });
    }, [companyFormData]);

    //update company
    const handleUpdateCompany = () => {
        setIsEditCompanyLoading(true);
        try {
            const updatedCompany = updateCompany(company.company_id, companyUpdateFormData);
            console.log(updatedCompany);
            //set the company to the value of the form.
            setCompany(companyUpdateFormData);
            addToast("Company updated successfully", "success");
        } catch (error) {
            console.error("Failed to update company:", error);
            addToast("Failed to update company", "error");
        }
        finally {
            setIsEditCompanyLoading(false);
            setIsEditCompany(false);
        }
    }

    //update companyInfo
    const handleUpdateCompanyInfo = () => {
        setIsEditCompanyInfoLoading(true);
        try {
            const updatedCompanyInfo = updateCompanyInfo(company.company_id, companyUpdateFormData);
            console.log(updatedCompanyInfo);
            //set the company to the value of the form.
            setCompany(companyUpdateFormData);
            addToast("Company updated successfully", "success");
        } catch (error) {
            console.error("Failed to update company info:", error);
            addToast("Failed to update company", "error");
        }
        finally {
            setIsEditCompanyInfoLoading(false);
            setIsEditCompanyInfo(false);
        }
    }

    return {
        dropdownOpen,
        setDropdownOpen,
        companies,
        setCompanies,
        company,
        setCompany,
        loading,
        changeSelectedCompany,
        isAddCompanyModalOpen,
        setIsAddCompanyModalOpen,
        companyFormData,
        setCompanyFormData,
        handleCreateCompany,
        isAddCompanyLoading,
        setIsAddCompanyLoading,
        addEditor,
        addApprover,
        removeUser,
        handleShowAddCompanyModal,
        companyUpdateFormData, setCompanyUpdateFormData,
        handleUpdateCompany,
        handleUpdateCompanyInfo,
        isEditCompany, setIsEditCompany,
        isEditCompanyInfo, setIsEditCompanyInfo,
        isEditCompanyInfoLoading, setIsEditCompanyInfoLoading,
        isEditCompanyLoading, setIsEditCompanyLoading,
        isEditCompanyModalOpen, setIsEditCompanyModalOpen,
        companyFullDetail, isCompanyFullDetailLoading,
        workingDays, setWorkingDays,
        payrollFrequency, setPayrollFrequency,
        ndRate, setNdRate,
        regularOTRate, setRegularOTRate,
        restdayRate, setRestdayRate,
    };
};

export default useCompany;
