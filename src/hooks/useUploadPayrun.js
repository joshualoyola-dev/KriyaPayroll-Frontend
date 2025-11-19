import { useState } from "react";
import { useToastContext } from "../contexts/ToastProvider";
import { useNavigate } from "react-router-dom";
import { parseExcelFile } from "../utility/upload.utility";

const formData = {
    date_from: '',
    date_to: '',
    payment_date: '',
    payrun_type: 'REGULAR',
};

const useUploadPayrun = () => {
    const [options, setOptions] = useState({ ...formData });
    const [payslips, setPayslips] = useState([]);
    const [payslipsLoading, setPayslipsLoading] = useState(false);
    const [employeesCheckLoading, setEmployeesCheckLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const { addToast } = useToastContext();
    const navigate = useNavigate();

    const handleClosePayrun = () => {
        setOptions({ ...formData });
        setPayslips([]);
        navigate('/payrun');
    };

    const handleInputChange = (field, value) => {
        setOptions(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const uploadPayrunFile = async (file) => {
        if (!file) {
            addToast("Please select a file", "error");
            return;
        };

        const fileExtension = file.name.split('.').pop().toLowerCase();

        if (!['xlsx', 'xls'].includes(fileExtension)) {
            addToast("Please upload a CSV or Excel file", "error");
            return;
        }

        setPayslipsLoading(true);

        try {
            let parsedData = [];
            parsedData = await parseExcelFile(file);

            if (parsedData.length === 0) {
                addToast("No data found in the file", "error");
                return;
            }

            // further processing
        } catch (error) {
            addToast(`Failed to process file: ${error.message}`, "error");
        }
        finally {
            setPayslipsLoading(false);
        }

    };

    return {
        options, setOptions,
        payslips, setPayslips,
        payslipsLoading, setPayslipsLoading,
        employeesCheckLoading, setEmployeesCheckLoading,
        isUploading, setIsUploading,

        handleClosePayrun,
        handleInputChange,
        uploadPayrunFile
    };
};

export default useUploadPayrun;