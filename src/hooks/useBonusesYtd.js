import { useState } from "react";
import { useCompanyContext } from "../contexts/CompanyProvider";
import { useToastContext } from "../contexts/ToastProvider";
import { getBonusesYtd } from "../services/payrun.service";

// Payitem IDs counted toward the ₱90k tax-exempt benefits threshold (TRAIN Law).
// Includes both taxable and non-taxable portions — the combined total determines
// whether the exemption ceiling has been exceeded (excess becomes taxable).
export const BONUS_PAYITEM_IDS = [
    'payitem-id-14', // 13th Month Bonus - Taxable
    'payitem-id-15', // 13th Month Bonus - Non-Taxable
    'payitem-id-16', // 14th Month Bonus - Taxable
    'payitem-id-17', // 14th Month Bonus - Non Taxable
    'payitem-id-18', // Social Activities Bonus
    'payitem-id-19', // Anniversary Bonus
];

export const BONUS_THRESHOLD = 90000;

const getDefaultDates = () => {
    const today = new Date();
    const year = today.getFullYear();
    const pad = (n) => String(n).padStart(2, "0");
    const start_date = `${year}-01-01`;
    const end_date = `${year}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
    return { start_date, end_date };
};

const useBonusesYtd = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState(null); // Map<emp_id, Map<payitem_id, number>>

    // Form state for the panel
    const [form, setForm] = useState({
        ...getDefaultDates(),
        filter_by: "paymentDate", // "paymentDate" | "titlePeriod"
        statuses: ["DRAFT", "FOR_APPROVAL", "REJECTED"],
    });

    const { company } = useCompanyContext();
    const { addToast } = useToastContext();

    const handleToggle = () => {
        setIsOpen(prev => !prev);
        if (!isOpen) {
            setData(null);
        }
    };

    const handleFormChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleStatusToggle = (status) => {
        setForm(prev => {
            const exists = prev.statuses.includes(status);
            return {
                ...prev,
                statuses: exists
                    ? prev.statuses.filter(s => s !== status)
                    : [...prev.statuses, status],
            };
        });
    };

    const handleFetch = async () => {
        if (!form.start_date || !form.end_date) {
            return addToast("Please provide both start and end dates", "error");
        }
        if (form.statuses.length === 0) {
            return addToast("Please select at least one payrun status", "error");
        }

        setIsLoading(true);
        try {
            const result = await getBonusesYtd(company.company_id, {
                date_start: form.start_date,
                date_end: form.end_date,
                payrun_payment_or_period: form.filter_by === "paymentDate" ? "PAYMENT" : "PERIOD",
                payrun_statuses: form.statuses,
            });
            setData(result.data.bonuses);
        } catch (error) {
            console.log(error);
            addToast("Failed to fetch bonuses YTD data", "error");
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isOpen,
        isLoading,
        data,
        form,
        handleToggle,
        handleFormChange,
        handleStatusToggle,
        handleFetch,
    };
};

export default useBonusesYtd;
