import { useState } from "react";

const useTopNav = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleLogout = () => {
        console.log("Logging out...");
        localStorage.clear();
        window.location.href = "/";
    };

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
        "/data-export": "Data Export",
        "/data-export/draft": "Data Export Draft",
        "/data-export/history": "Data Export History",
    };

    return {
        dropdownOpen, setDropdownOpen,
        handleLogout,
        paths,
    }
};

export default useTopNav;