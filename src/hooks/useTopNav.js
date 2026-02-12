import { useState, useMemo } from "react";
import { DATA_EXPORT_FORM_TYPES, getHistoryPath, getAddNewPath } from "../configs/data-export.config";

const useTopNav = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleLogout = () => {
        console.log("Logging out...");
        localStorage.clear();
        window.location.href = "/";
    };

    // Data Export pages show their title in the page content only; leave TopNav blank for those routes
    const dataExportPaths = useMemo(() => {
        const map = {};
        DATA_EXPORT_FORM_TYPES.forEach((form) => {
            map[getHistoryPath(form.id)] = "";
            map[getAddNewPath(form.id)] = "";
        });
        return map;
    }, []);

    const paths = {
        "/dashboard": "Dashboard",
        "/payrun": "Payrun",
        "/payrun/regular": "Regular Payrun",
        "/payrun/last": "Last Payrun",
        "/payrun/special": "Special Payrun",
        "/payrun/send-payslips": "Send Payslip",
        "/payrun/upload": "Payrun Upload",
        "/employee": "Employee",
        "/attendance": "Attendance",
        "/attendance/overtime": "Overtime",
        "/attendance/leave": "Leave",
        "/attendance/absence": "Absence",
        "/attendance/restday": "Restday",
        "/attendance/holiday": "Holiday",
        "/company": "Company",
        "/configuration/payitem": "Payitem",
        "/configuration/company-configuration": "Company Configuration",
        "/configuration/recurring-pay": "Recurring Pay",
        "/configuration/contribution": "Contributions",
        ...dataExportPaths,
    };

    return {
        dropdownOpen, setDropdownOpen,
        handleLogout,
        paths,
    }
};

export default useTopNav;