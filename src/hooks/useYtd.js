import { useState } from "react";
import { fetchYearToDate } from "../services/data-export.service";
import { useCompanyContext } from "../contexts/CompanyProvider";
import { convertToISO8601, formatDateToWords } from "../utility/datetime.utility";
import { useToastContext } from "../contexts/ToastProvider";
import { useEmployeeContext } from "../contexts/EmployeeProvider";
import { usePayitemContext } from "../contexts/PayitemProvider";
import { downloadExcelMatrix } from "../utility/excel.utility";

const formData = {
    date_start: '',
    date_end: '',
    active_employees: true,
    payrun_payment_or_period: 'PAYMENT',
    payrun_status: ['APPROVED'],
};

const useYtd = () => {
    const [ytds, setYtds] = useState([]);
    const [ytdsLoading, setYtdsLoading] = useState(false);
    const [downloadLoading, setDownloadLoading] = useState(false);
    const [dateRangeFormData, setDateRangeFormData] = useState({ ...formData });

    const { company } = useCompanyContext();
    const { addToast } = useToastContext();
    const { mapEmployeeIdToEmployeeName } = useEmployeeContext();
    const { mapPayitemIdToPayitemName } = usePayitemContext();

    const handleGenerateYTD = async () => {
        setYtdsLoading(true);

        try {
            const date_start = convertToISO8601(dateRangeFormData.date_start);
            const date_end = convertToISO8601(dateRangeFormData.date_end);
            const response = await fetchYearToDate(company.company_id, date_start, date_end, dateRangeFormData.active_employees, dateRangeFormData.payrun_payment_or_period);
            setYtds(response.data.ytds);
        } catch (error) {
            console.log(error);
            addToast("Failed to fetch the year-to-date data", "error");
        }
        finally {
            setYtdsLoading(false);
        }
    };

    const handleDownload = () => {
        setDownloadLoading(true);
        try {
            const filename = `Year-to-Date - ${formatDateToWords(dateRangeFormData.date_start)} to ${formatDateToWords(dateRangeFormData.date_end)}`;
            downloadExcelMatrix(ytds, mapEmployeeIdToEmployeeName, mapPayitemIdToPayitemName, filename, 'Year-to-Date');
            return;
        } catch (error) {
            addToast(`Failed to download the year to date summary: ${error.message}`, "error");
        }
        finally {
            setDownloadLoading(false);
        }
    };

    return {
        ytds, setYtds,
        ytdsLoading, setYtdsLoading,
        downloadLoading, setDownloadLoading,
        dateRangeFormData, setDateRangeFormData,
        handleGenerateYTD,
        handleDownload
    };
};

export default useYtd;