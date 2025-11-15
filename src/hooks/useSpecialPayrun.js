import { useEffect, useState } from "react";
import { usePayitemContext } from "../contexts/PayitemProvider";
import { useEmployeeContext } from "../contexts/EmployeeProvider";
import { useToastContext } from "../contexts/ToastProvider";
import { validateDailyRecordOfOneEmployee } from "../services/attendance.service";
import { convertToISO8601 } from "../utility/datetime.utility";
import { generateRegularPayrun, getPayrun, getPayrunPayslipPayables, saveEdit, saveRegularPayrunDraft, updateStatus } from "../services/payrun.service";
import { useCompanyContext } from "../contexts/CompanyProvider";
import { useLocation, useNavigate } from "react-router-dom";
import { sanitizedPayslips } from "../utility/payrun.utility";
import { usePayrunContext } from "../contexts/PayrunProvider";
import { fetchPayrunLogs } from "../services/log.service";

const formData = {
    date_from: '',
    date_to: '',
    payment_date: '',
    pay_items: [
        { 'payitem-id-01': "Tax Withheld" },
        { 'payitem-id-02': "Basic Pay" },
    ], //payitem_id : pay_item_name in the column
    employee_ids: [], //employees subject to special payrun
};

const useSpecialPayrun = () => {
    const [payrun, setPayrun] = useState(null);
    const [options, setOptions] = useState({ ...formData });
    const [payslips, setPayslips] = useState([]);
    const [oldPayslips, setOldPayslips] = useState([]);
    const [payslipsLoading, setPayslipsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [statusLoading, setStatusLoading] = useState(false);
    const [isInitializing, setIsInitializing] = useState(false);
    const [logs, setLogs] = useState([]);
    const [logsLoading, setLogsLoading] = useState(false);
    const [toggleLogs, setToggleLogs] = useState(false);

    const { payitems } = usePayitemContext();
    const { activeEmployees } = useEmployeeContext();
    const { addToast } = useToastContext();
    const { company } = useCompanyContext();
    const { handleFetchPayruns } = usePayrunContext();

    const location = useLocation();
    const navigate = useNavigate();

    return {};
};

export default useSpecialPayrun;