import { useEffect, useState } from "react";
import { useCompanyContext } from "../contexts/CompanyProvider";
import { useToastContext } from "../contexts/ToastProvider";
import { addOneOvertime, deleteOneOvertime, fetchOvertimes } from "../services/overtime.service";
import * as XLSX from 'xlsx';
import { formatDateToISO18601, normalizeHeader, parseExcelDate, parseExcelFile } from "../utility/upload.utility";
import useDebounce from "./useDebounce";
import { useLocation } from "react-router-dom";

const formData = {
    employee_id: '',
    overtime_date: '',
    ot_hours: '',
    ot_hsameday: '',
    ot_hnextday: '',
    nd_ot_hours: '',
    ndot_hsameday: '',
    ndot_hnextday: '',
    overtime_type: 'REGULAR_DAY',
    overtime_status: 'PENDING',
};

const filterFields = {
    employee_id: '',
    from: '',
    to: '',
}

const useOvertime = () => {
    const [overtimes, setOvertimes] = useState([]);
    const [overtime, setOvertime] = useState();
    const [isOvertimesLoading, setIsOvertimesLoading] = useState(false);
    const [showOvertimeModal, setShowOvertimeModal] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isAddOvertimeLoading, setIsAddOvertimeLoading] = useState(false);
    const [overtimeFormData, setOvertimeFormData] = useState([{
        id: Date.now(),
        ...formData
    }]);
    const [filters, setFilters] = useState({ ...filterFields });
    const [limit, setLimit] = useState(20);


    const debouncedQuery_employee_id = useDebounce(filters.employee_id, 800);
    const debouncedQuery_to = useDebounce(filters.to, 800);
    const debouncedQuery_from = useDebounce(filters.from, 800);


    // Contexts
    const { company } = useCompanyContext();
    const { addToast } = useToastContext();
    const location = useLocation();

    const handleFetchOvertimes = async () => {
        setIsOvertimesLoading(true);

        console.log('runniing fetchin overtimes: ');


        try {
            const result = await fetchOvertimes(
                company.company_id,
                debouncedQuery_employee_id || null,
                debouncedQuery_from || null,
                debouncedQuery_to || null,
                limit,
            );
            setOvertimes(result.data.overtimes);
        } catch (error) {
            console.error(error);
            addToast("Failed to fetch overtimes", "error");
        }
        finally {
            setIsOvertimesLoading(false);
        }
    };

    useEffect(() => {
        if (!company) return;

        if (location.pathname === '/attendance/overtime') {
            handleFetchOvertimes();
        }

    }, [company, debouncedQuery_employee_id, debouncedQuery_to, debouncedQuery_from, limit, location.pathname]); // Fixed: Added dependency array

    // Modal related function
    const handleShowOvertimeModal = () => {
        setShowOvertimeModal(!showOvertimeModal);
    };

    // Form data manipulation
    const handleAddRow = () => {
        const newRow = { ...formData, id: Date.now() };
        setOvertimeFormData(prev => [...prev, newRow]);
    };

    const handleRemoveRow = (id) => {
        if (overtimeFormData.length > 1) {
            setOvertimeFormData(prev => prev.filter(row => row.id !== id));
        }
    };

    const handleFieldChange = (id, field, value) => {
        setOvertimeFormData(prev =>
            prev.map(row =>
                row.id === id ? { ...row, [field]: value } : row
            )
        );
    };

    const handleResetForm = () => {
        setOvertimeFormData([{ ...formData, id: Date.now() }]);
    };

    // Adding
    const handleAddOvertime = async () => {
        setIsAddOvertimeLoading(true);
        try {
            // Fixed: Check for overtime_date instead of attendance_date
            const validOvertimes = overtimeFormData.filter(ot =>
                ot.employee_id && ot.employee_id.trim() && ot.overtime_date
            );

            if (validOvertimes.length === 0) {
                addToast("Please provide employee_id and overtime_date for each overtime record", "error");
                return;
            }

            const failedOvertimes = [];

            for (const ot of validOvertimes) {
                try {
                    // Clean up and format the data before sending
                    const cleaned = { ...ot };
                    delete cleaned.id; // Remove the UI-only id field

                    // Convert string numbers to actual numbers for backend
                    const numberFields = [
                        'ot_hours',
                        'ot_hsameday',
                        'ot_hnextday',
                        'nd_ot_hours',
                        'ndot_hsameday',
                        'ndot_hnextday',
                    ];

                    numberFields.forEach(field => {
                        if (cleaned[field] !== '' && cleaned[field] !== null && cleaned[field] !== undefined) {
                            const numValue = Number(cleaned[field]);
                            cleaned[field] = isNaN(numValue) ? null : numValue;
                        } else {
                            cleaned[field] = null;
                        }
                    });

                    await addOneOvertime(company.company_id, cleaned);
                    addToast(`Successfully added overtime: ${ot.employee_id}`, "success");
                } catch (error) {
                    console.error('Error adding overtime:', error);
                    addToast(`Error adding overtime for employee: ${ot.employee_id}`, "error");
                    failedOvertimes.push(ot);
                }
            }

            if (failedOvertimes.length > 0) {
                setOvertimeFormData(failedOvertimes);
                await handleFetchOvertimes();
            } else {
                handleResetForm();
                await handleFetchOvertimes();
                //close modal
                handleShowOvertimeModal();
            }
        } catch (error) {
            console.error('Error:', error);
            addToast("Failed to add overtimes", "error");
        } finally {
            setIsAddOvertimeLoading(false);
        }
    };

    // Delete
    const handleDeleteOneOvertime = async (rowData) => {
        try {
            await deleteOneOvertime(company.company_id, rowData.employee_overtime_id);
            addToast("Records successfully deleted", "success");
            // Trigger reload of overtimes
            await handleFetchOvertimes();
        } catch (error) {
            console.log(error);
            addToast("Failed to delete record", "error");
        }
    };

    // File uploading
    const mapFileDataToForm = (data) => {
        const validOvertimeType = [
            'REGULAR_DAY',
            'REST_DAY',
            'SPECIAL_HOLIDAY',
            'REGULAR_HOLIDAY',
            'REST_DAY_SPECIAL_HOLIDAY', // Fixed: Removed 's' typo
            'REST_DAY_REGULAR_HOLIDAY'
        ];

        const validOvertimeStatus = ['PENDING', 'ACCEPTED', 'REJECTED'];

        return data.map((row, index) => {
            const mappedRow = { ...formData, id: Date.now() + index };

            // Get valid form keys
            const formKeys = Object.keys(formData);

            Object.entries(row).forEach(([key, value]) => {
                const normalizedKey = normalizeHeader(key); // Fixed: Apply normalizeHeader to key

                // Find matching form field
                const matchingField = formKeys.find(
                    (formKey) => normalizeHeader(formKey) === normalizedKey
                );

                if (matchingField && value !== null && value !== undefined && value !== "") {
                    // Handle employee_id (string)
                    if (matchingField === "employee_id") {
                        mappedRow[matchingField] = String(value).trim();
                    }
                    // Handle overtime_date (date field - YYYY-MM-DD)
                    else if (matchingField === "overtime_date") {
                        const parsedDate = parseExcelDate(value);
                        mappedRow[matchingField] = formatDateToISO18601(parsedDate);
                    }
                    // Handle decimal/number fields
                    else if ([
                        'ot_hours',
                        'ot_hsameday',
                        'ot_hnextday',
                        'nd_ot_hours',
                        'ndot_hsameday',
                        'ndot_hnextday',
                    ].includes(matchingField)) {
                        const numValue = Number(value);
                        mappedRow[matchingField] = isNaN(numValue) ? '' : numValue.toString();
                    }
                    // Handle overtime type enum
                    else if (matchingField === "overtime_type") { // Fixed: Changed from "shift_type"
                        const overtimeType = String(value).toUpperCase().trim();
                        mappedRow[matchingField] = validOvertimeType.includes(overtimeType) ? overtimeType : "";
                    }
                    // Handle overtime status enum
                    else if (matchingField === "overtime_status") {
                        const overtimeStatus = String(value).toUpperCase().trim();
                        mappedRow[matchingField] = validOvertimeStatus.includes(overtimeStatus) ? overtimeStatus : 'PENDING';
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

    const uploadOvertimeFile = async (file) => {
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
            // Added: Handle CSV files
            else if (fileExtension === 'csv') {
                // You'll need to implement CSV parsing or use a library like papaparse
                // For now, assuming parseExcelFile can handle CSV too
                parsedData = await parseExcelFile(file);
            }

            if (parsedData.length === 0) {
                addToast("No data found in the file", "error");
                return;
            }

            // Map the data to form structure
            const mappedData = mapFileDataToForm(parsedData);

            // Fixed: Filter for overtime_date instead of attendance_date
            const validData = mappedData.filter(row =>
                row.employee_id && row.employee_id.trim() &&
                row.overtime_date
            );

            if (validData.length === 0) {
                addToast("No valid data found in the file. Please ensure employee_id and overtime_date are provided.", "error");
                return;
            }

            // Update the form data
            setOvertimeFormData(validData);

            addToast(`Successfully loaded ${validData.length} overtime record(s) from file`, "success");

        } catch (error) {
            console.error('File upload error:', error);
            addToast(`Failed to process file: ${error.message}`, "error");
        } finally {
            setIsUploading(false);
        }
    };


    //handle row click
    const handleRowClick = (data, row) => {
        console.log('clicked: ', data);
    }

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
        // State
        overtimes,
        setOvertimes,
        overtime,
        setOvertime,
        isOvertimesLoading,
        setIsOvertimesLoading,
        showOvertimeModal, // Added: Missing return value
        isUploading, // Added: Missing return value
        isAddOvertimeLoading, // Added: Missing return value

        // Data fetching
        handleFetchOvertimes,

        // Form data
        overtimeFormData,
        setOvertimeFormData,

        // Modal
        handleShowOvertimeModal,

        // Form manipulation 
        handleAddRow,
        handleRemoveRow,
        handleFieldChange,
        handleResetForm,

        // CRUD operations
        handleAddOvertime,
        handleDeleteOneOvertime,

        // File upload
        uploadOvertimeFile,

        //onclick
        handleRowClick,

        //filter
        filters, setFilters,
        handleResetFilter, handleFilterChange,

        //pagination
        limit, setLimit
    };
};

export default useOvertime;