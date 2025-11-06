import { useEffect, useState } from "react";
import { useToastContext } from "../contexts/ToastProvider";
import { useCompanyContext } from "../contexts/CompanyProvider";
import { deleteOneLeave, fetchLeaves, addOneLeave } from "../services/leave.service";
import * as XLSX from 'xlsx';
import { formatDateToISO18601, normalizeHeader, parseExcelDate, parseExcelDateTime, parseExcelFile } from "../utility/upload.utility";
import useDebounce from "./useDebounce";
import { useLocation } from "react-router-dom";

const formData = {
    employee_id: '',
    leave_date: '', // date type. and in YY-MM-DD format
    leave_type: 'SICK_LEAVE', // sick leave, maternity leave, paternity leave, etc.
    leave_status: 'PENDING', // PENDING, ACCEPTED, REJECTED
    is_paid: false,
};


const filterFields = {
    employee_id: '',
    from: '',
    to: '',
}

const useLeave = () => {
    const [leaves, setLeaves] = useState([]);
    const [leave, setLeave] = useState();
    const [isLeavesLoading, setIsLeavesLoading] = useState(false);
    const [showLeaveModal, setShowLeaveModal] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isAddLeaveLoading, setIsAddLeaveLoading] = useState(false);
    const [leavesFormData, setLeavesFormData] = useState([{
        id: Date.now(),
        ...formData
    }]);
    const [filters, setFilters] = useState({ ...filterFields });
    const [limit, setLimit] = useState(20);

    const debouncedQuery_employee_id = useDebounce(filters.employee_id, 800);
    const debouncedQuery_to = useDebounce(filters.to, 800);
    const debouncedQuery_from = useDebounce(filters.from, 800);


    // Contexts
    const { addToast } = useToastContext();
    const { company } = useCompanyContext();
    const location = useLocation();

    const handleFetchLeaves = async () => {
        setIsLeavesLoading(true);

        try {
            const result = await fetchLeaves(
                company.company_id,
                debouncedQuery_employee_id || null,
                debouncedQuery_from || null,
                debouncedQuery_to || null,
                limit
            );

            setLeaves(result.data.leaves);
        } catch (error) {
            console.error(error);
            addToast("Failed to fetch leaves", "error");
        } finally {
            setIsLeavesLoading(false);
        }
    };

    useEffect(() => {
        if (!company) return;

        if (location.pathname === '/attendance/leave') {
            handleFetchLeaves();
        }

    }, [company, debouncedQuery_employee_id, debouncedQuery_to, debouncedQuery_from, limit, location.pathname]);

    // Modal related function
    const handleShowLeaveModal = () => {
        setShowLeaveModal(!showLeaveModal);
    };

    // Form data manipulation
    const handleAddRow = () => {
        const newRow = { ...formData, id: Date.now() };
        setLeavesFormData(prev => [...prev, newRow]);
    };

    const handleRemoveRow = (id) => {
        if (leavesFormData.length > 1) {
            setLeavesFormData(prev => prev.filter(row => row.id !== id));
        }
    };

    const handleFieldChange = (id, field, value) => {
        setLeavesFormData(prev =>
            prev.map(row =>
                row.id === id ? { ...row, [field]: value } : row
            )
        );
    };

    const handleResetForm = () => {
        setLeavesFormData([{ ...formData, id: Date.now() }]);
    };

    // Adding
    const handleAddLeave = async () => {
        setIsAddLeaveLoading(true);
        try {
            const validLeaves = leavesFormData.filter(leave =>
                leave.employee_id && leave.employee_id.trim() && leave.leave_date
            );

            if (validLeaves.length === 0) {
                addToast("Please provide employee_id and leave_date for each leave record", "error");
                return;
            }

            const failedLeaves = [];

            for (const leave of validLeaves) {
                try {
                    // Clean up and format the data before sending
                    const cleaned = { ...leave };
                    delete cleaned.id; // Remove the UI-only id field

                    // Convert is_paid to boolean
                    cleaned.is_paid = Boolean(cleaned.is_paid);

                    await addOneLeave(company.company_id, cleaned);
                    addToast(`Successfully added leave: ${leave.employee_id}`, "success");
                } catch (error) {
                    console.error('Error adding leave:', error);
                    addToast(`Error adding leave for employee: ${leave.employee_id}`, "error");
                    failedLeaves.push(leave);
                }
            }

            if (failedLeaves.length > 0) {
                setLeavesFormData(failedLeaves);
                await handleFetchLeaves();
            } else {
                handleResetForm();
                await handleFetchLeaves();
                //close modal
                handleShowLeaveModal();
            }
        } catch (error) {
            console.error('Error:', error);
            addToast("Failed to add leaves", "error");
        } finally {
            setIsAddLeaveLoading(false);
        }
    };

    // Delete
    const handleDeleteOneLeave = async (rowData) => {
        try {
            await deleteOneLeave(company.company_id, rowData.employee_leave_id);
            addToast("Records successfully deleted", "success");
            // Trigger reload of leaves
            await handleFetchLeaves();
        } catch (error) {
            console.log(error);
            addToast("Failed to delete record", "error");
        }
    };

    // File uploading
    const mapFileDataToForm = (data) => {
        const validLeaveType = [
            'SICK_LEAVE',
            'VACATION_LEAVE',
            'MATERNITY_LEAVE',
            'PATERNITY_LEAVE',
            'EMERGENCY_LEAVE',
            'BEREAVEMENT_LEAVE',
            'PERSONAL_LEAVE',
            'OTHER'
        ];

        const validLeaveStatus = ['PENDING', 'ACCEPTED', 'REJECTED'];

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
                    // Handle leave_date (date field - YYYY-MM-DD)
                    else if (matchingField === "leave_date") {
                        const parsedDate = parseExcelDate(value);
                        mappedRow[matchingField] = formatDateToISO18601(parsedDate);
                    }
                    // Handle leave type enum
                    else if (matchingField === "leave_type") {
                        const leaveType = String(value).toUpperCase().trim();
                        mappedRow[matchingField] = validLeaveType.includes(leaveType) ? leaveType : 'SICK_LEAVE';
                    }
                    // Handle leave status enum
                    else if (matchingField === "leave_status") {
                        const leaveStatus = String(value).toUpperCase().trim();
                        mappedRow[matchingField] = validLeaveStatus.includes(leaveStatus) ? leaveStatus : 'PENDING';
                    }
                    // Handle is_paid boolean
                    else if (matchingField === "is_paid") {
                        const stringValue = String(value).toLowerCase().trim();
                        mappedRow[matchingField] = ['true', '1', 'yes', 'paid'].includes(stringValue);
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

    const uploadLeaveFile = async (file) => {
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
            } else if (fileExtension === 'csv') {
                parsedData = await parseExcelFile(file);
            }

            if (parsedData.length === 0) {
                addToast("No data found in the file", "error");
                return;
            }

            // Map the data to form structure
            const mappedData = mapFileDataToForm(parsedData);

            const validData = mappedData.filter(row =>
                row.employee_id && row.employee_id.trim() &&
                row.leave_date
            );

            if (validData.length === 0) {
                addToast("No valid data found in the file. Please ensure employee_id and leave_date are provided.", "error");
                return;
            }

            // Update the form data
            setLeavesFormData(validData);

            addToast(`Successfully loaded ${validData.length} leave record(s) from file`, "success");

        } catch (error) {
            console.error('File upload error:', error);
            addToast(`Failed to process file: ${error.message}`, "error");
        } finally {
            setIsUploading(false);
        }
    };

    // Handle row click
    const handleRowClick = (data, row) => {
        console.log('clicked: ', data);
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
        // State
        leaves,
        setLeaves,
        leave,
        setLeave,
        isLeavesLoading,
        setIsLeavesLoading,
        showLeaveModal,
        isUploading,
        isAddLeaveLoading,

        // Data fetching
        handleFetchLeaves,

        // Form data
        leavesFormData,
        setLeavesFormData,

        // Modal
        handleShowLeaveModal,

        // Form manipulation
        handleAddRow,
        handleRemoveRow,
        handleFieldChange,
        handleResetForm,

        // CRUD operations
        handleAddLeave,
        handleDeleteOneLeave,

        // File upload
        uploadLeaveFile,

        // onClick
        handleRowClick,

        //filter
        filters, setFilters,
        handleResetFilter, handleFilterChange,

        //pagination
        limit, setLimit
    };
};

export default useLeave;