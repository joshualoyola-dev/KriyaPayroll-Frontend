import { useEffect, useState } from "react";
import { useCompanyContext } from "../contexts/CompanyProvider";
import { useToastContext } from "../contexts/ToastProvider";
import { addOneRecurringPay, deleteOneRecurringPay, getRecurringPays } from "../services/recurring-pay.service";
import { formatDateToISO18601, normalizeHeader, parseExcelDateTime, parseExcelFile } from "../utility/upload.utility";
import useDebounce from "./useDebounce";

const formData = {
    employee_id: '',
    payitem_id: '',
    amount: '',
    date_start: '',
    date_end: '',
};

const filterFields = {
    employee_id: '',
    from: '',
    to: '',
}


const useRecurringPay = () => {
    const [recurringPays, setRecurringPays] = useState([]);
    const [recurringPaysLoading, setRecurringPaysLoading] = useState(false);
    const [recurringPayAddLoading, setRecurringPayAddLoading] = useState(false);
    const [showRecurringPayModal, setShowRecurringPayModal] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [recurringPayFormData, setRecurringPayFormData] = useState([
        { id: Date.now(), ...formData }
    ]);
    const [filters, setFilters] = useState({ ...filterFields });

    const debouncedQuery_employee_id = useDebounce(filters.employee_id, 800);
    const debouncedQuery_to = useDebounce(filters.to, 800);
    const debouncedQuery_from = useDebounce(filters.from, 800);


    const { company } = useCompanyContext();
    const { addToast } = useToastContext();

    const handleFetchRecurringPays = async () => {
        setRecurringPaysLoading(true);

        try {
            const result = await getRecurringPays(
                company.company_id,
                debouncedQuery_employee_id || null,
                debouncedQuery_from || null,
                debouncedQuery_to || null
            );
            setRecurringPays(result.data.recurring_pays);
        } catch (error) {
            console.log(error);
            addToast("Failed to fetch recurring pays", "error");
        }
        finally {
            setRecurringPaysLoading(false);
        }
    };

    useEffect(() => {
        if (!company) return;

        handleFetchRecurringPays();
    }, [company, debouncedQuery_employee_id, debouncedQuery_to, debouncedQuery_from]);

    // Form data manipulation
    const handleAddRow = () => {
        const newRow = { ...formData, id: Date.now() };
        setRecurringPayFormData(prev => [...prev, newRow]);
    };

    const handleRemoveRow = (id) => {
        if (recurringPayFormData.length > 1) {
            setRecurringPayFormData(prev => prev.filter(row => row.id !== id));
        }
    };

    const handleFieldChange = (id, field, value) => {
        setRecurringPayFormData(prev =>
            prev.map(row =>
                row.id === id ? { ...row, [field]: value } : row
            )
        );
    };

    const handleResetForm = () => setRecurringPayFormData([{ id: Date.now(), ...formData }]);

    const handleShowRecurringPayModal = () => setShowRecurringPayModal(!showRecurringPayModal);

    const handleAddRecurringPays = async () => {
        setRecurringPayAddLoading(true);

        try {
            const failedRecurringPays = [];

            for (const recurring of recurringPayFormData) {
                try {
                    const cleaned = { ...recurring };
                    delete cleaned.id; // Remove the UI-only id field

                    // Convert string numbers to actual numbers for backend
                    const numberFields = [
                        'amount',
                    ];

                    numberFields.forEach(field => {
                        if (cleaned[field] !== '' && cleaned[field] !== null && cleaned[field] !== undefined) {
                            const numValue = Number(cleaned[field]);
                            cleaned[field] = isNaN(numValue) ? null : numValue;
                        } else {
                            cleaned[field] = null;
                        }
                    });

                    // Handle optional date fields - convert empty strings to null
                    const optionalDateFields = [
                        'date_end',
                    ];

                    optionalDateFields.forEach(field => {
                        if (cleaned[field] === '' || cleaned[field] === null || cleaned[field] === undefined) {
                            cleaned[field] = null;
                        }
                    });

                    await addOneRecurringPay(company.company_id, cleaned);
                    addToast(`Successfully added recurring pay: ${cleaned.employee_id}`, "success");
                } catch (error) {
                    console.error('Error adding recurring pay:', error);
                    addToast(`Error adding recurring pay for employee: ${recurring.employee_id}`, "error");
                    failedRecurringPays.push(recurring);
                }
            }

            if (failedRecurringPays.length > 0) {
                setRecurringPayFormData(failedRecurringPays);
                await handleFetchRecurringPays();
            }
            else {
                handleResetForm();
                await handleFetchRecurringPays();
                //close modal
                handleShowRecurringPayModal();
            }
        } catch (error) {
            console.error('Error:', error);
            addToast("Failed to add recurring pays", "error");
        }
        finally {
            setRecurringPayAddLoading(false);
        }
    };



    const handleRowClick = (data, row) => {
        console.log('clicked: ', data);
    }

    const handleDeleteOneRecurringPay = async (rowData) => {
        try {
            await deleteOneRecurringPay(rowData.recurring_pay_id);
            addToast("Records successfully deleted", "success");
            await handleFetchRecurringPays();
        } catch (error) {
            console.log(error);
            addToast("Failed to delete record", "error");
        }
    }

    // File uploading
    const mapFileDataToForm = (data) => {
        return data.map((row, index) => {
            const mappedRow = { ...formData, id: Date.now() + index };

            // Get valid form keys
            const formKeys = Object.keys(formData);

            Object.entries(row).forEach(([key, value]) => {
                const normalizedKey = normalizeHeader(key);

                // Find matching form field
                const matchingField = formKeys.find(
                    (formKey) => normalizeHeader(formKey) === normalizedKey
                );

                if (matchingField && value !== null && value !== undefined && value !== "") {
                    // Handle employee_id (string)
                    if (matchingField === "employee_id") {
                        mappedRow[matchingField] = String(value).trim();
                    }
                    // Handle date_start and date_end (date field - YYYY-MM-DD)
                    else if (matchingField === "date_start" || matchingField === "date_end") {
                        const parsedDate = parseExcelDateTime(value);
                        mappedRow[matchingField] = formatDateToISO18601(parsedDate);
                    }
                    // Handle decimal/number fields
                    else if ([
                        'amount',
                    ].includes(matchingField)) {
                        const numValue = Number(value);
                        mappedRow[matchingField] = isNaN(numValue) ? '' : numValue.toString();
                    }
                    // Everything else (fallback to string)
                    else {
                        mappedRow[matchingField] = String(value).trim();
                    }
                }
            });

            return mappedRow;
        });
    };

    const uploadRecurringPayFile = async (file) => {
        if (!file) {
            addToast("Please select a file", "error");
            return;
        }

        const fileExtension = file.name.split('.').pop().toLowerCase();

        if (!['csv', 'xlsx', 'xls'].includes(fileExtension)) {
            addToast("Please upload a CSV or Excel file", "error");
            return;
        }

        setIsUploading(true);

        try {
            let parsedData = [];

            if (fileExtension === 'xlsx' || fileExtension === 'xls') {
                parsedData = await parseExcelFile(file);
            }
            else if (fileExtension === 'csv') {
                parsedData = await parseExcelFile(file);
            }

            if (parsedData.length === 0) {
                addToast("No data found in the file", "error");
                return;
            }

            // Map the data to form structure
            const mappedData = mapFileDataToForm(parsedData);

            // Fixed: Filter for recurring pay fields instead of overtime_date
            const validData = mappedData.filter(row =>
                row.employee_id && row.employee_id.trim() &&
                row.payitem_id && row.date_start
            );

            if (validData.length === 0) {
                addToast("No valid data found in the file. Please ensure employee_id, payitem_id, and date_start are provided.", "error");
                return;
            }

            // Update the form data
            setRecurringPayFormData(validData);

            addToast(`Successfully loaded ${validData.length} recurring pay record(s) from file`, "success");

        } catch (error) {
            console.error('File upload error:', error);
            addToast(`Failed to process file: ${error.message}`, "error");
        } finally {
            setIsUploading(false);
        }
    };


    //reset fielter
    const handleResetFilter = () => {
        setFilters({ ...filterFields });
    };

    //handleChange fieldter
    const handleFilterChange = (field, value) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return {
        recurringPays,
        setRecurringPays,
        recurringPayFormData,
        setRecurringPayFormData,
        recurringPaysLoading,
        setRecurringPaysLoading,
        recurringPayAddLoading,
        setRecurringPayAddLoading,
        showRecurringPayModal,
        setShowRecurringPayModal,
        handleFetchRecurringPays,
        handleAddRecurringPays,
        handleRowClick,
        handleDeleteOneRecurringPay,
        handleShowRecurringPayModal,

        //form manipulation
        handleAddRow,
        handleRemoveRow,
        handleFieldChange,
        handleResetForm,

        //uploading
        isUploading,
        setIsUploading,
        uploadRecurringPayFile,

        //filter
        filters, setFilters,
        handleResetFilter, handleFilterChange,
    }
};

export default useRecurringPay;