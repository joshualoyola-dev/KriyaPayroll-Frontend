import { useState, useMemo } from "react";
import { BanknotesIcon } from "@heroicons/react/24/solid";

const usePayrunFilters = (payruns = []) => {
    const [selectedTab, setSelectedTab] = useState('regular');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [fromDate, setFromDateState] = useState("");
    const [toDate, setToDateState] = useState("");
    const [dateFilterActive, setDateFilterActive] = useState(false);
    const [dateFilterType, setDateFilterType] = useState("paymentDate");
    

    const setFromDate = (val) => {
        setFromDateState(val);
        setDateFilterActive(!!val || !!toDate);
    };
    const setToDate = (val) => {
        setToDateState(val);
        setDateFilterActive(!!fromDate || !!val);
    };

    const payrunTabs = useMemo(() => [
        { key: 'regular', label: 'Regular Payrun', icon: BanknotesIcon },
        { key: 'special', label: 'Special Payrun', icon: BanknotesIcon },
        { key: 'last', label: 'Last Payrun', icon: BanknotesIcon },
    ], []);

    const filterByStatus = (payrunsArr) => {
        if (selectedStatus === 'All') return payrunsArr;
        return payrunsArr.filter(payrun => payrun.status === selectedStatus);
    };

    const filterByDate = (payrunsArr) => {
        if (!dateFilterActive || (!fromDate && !toDate)) return payrunsArr;
        return payrunsArr.filter(payrun => {
            let payrunDate = "";
            if (dateFilterType === "paymentDate") {
                payrunDate = payrun.payment_date ? payrun.payment_date.slice(0, 10) : "";
            } else {
                payrunDate = payrun.payrun_start_date ? payrun.payrun_start_date.slice(0, 10) : "";
            }
            if (fromDate && toDate) {
                return payrunDate >= fromDate && payrunDate <= toDate;
            } else if (fromDate) {
                return payrunDate >= fromDate;
            } else if (toDate) {
                return payrunDate <= toDate;
            }
            return true;
        });
    };

    const applyAllFilters = (arr, type) => {
        let filtered = arr.filter(payrun => payrun.payrun_type === type);
        filtered = filterByStatus(filtered);
        filtered = filterByDate(filtered);
        return filtered;
    };

    const payrunTypeMap = useMemo(() => ({
        regular: applyAllFilters(payruns, 'REGULAR'),
        special: applyAllFilters(payruns, 'SPECIAL'),
        last: applyAllFilters(payruns, 'LAST'),
    }), [payruns, selectedStatus, fromDate, toDate, dateFilterActive, dateFilterType]);

    return {
        selectedTab,
        setSelectedTab,
        selectedStatus,
        setSelectedStatus,
        fromDate,
        setFromDate,
        toDate,
        setToDate,
        payrunTabs,
        payrunTypeMap,
        dateFilterType,
        setDateFilterType
    };
};

export default usePayrunFilters;
