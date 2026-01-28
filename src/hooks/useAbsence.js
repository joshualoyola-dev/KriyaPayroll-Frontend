import { useCallback, useEffect, useState } from "react";
import { useCompanyContext } from "../contexts/CompanyProvider";
import { useToastContext } from "../contexts/ToastProvider";
import { addOneAbsence, deleteOneAbsence, fetchAbsences } from "../services/absence.service";
import { formatDateToISO18601, normalizeHeader, parseExcelDate, parseExcelDateTime, parseExcelFile } from "../utility/upload.utility";
import useDebounce from "./useDebounce";
import { useLocation } from "react-router-dom";

const formData = {
    employee_id: '',
    absence_date: '',
    absence_type: 'SICK', //SICK, MATERNITY, PATERNITY, VACATION, BEREAVEMENT, etc
    absence_status: "PENDING", //PENDING, ACCEPTED, REJECTED
    is_half_day: false,
    is_paid: false,
};

const filterFields = {
    employee_id: '',
    from: '',
    to: '',
}

const useAbsence = () => {
    const [absences, setAbsences] = useState([]);
    const [absence, setAbsence] = useState();
    const [isAbsencesLoading, setIsAbsencesLoading] = useState(false);
    const [showAbsenceModal, setShowAbsenceModal] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isAddAbsenceLoading, setIsAddAbsenceLoading] = useState(false);
    const [absencesFormData, setAbsencesFormData] = useState([
        { id: Date.now(), ...formData }
    ]);
    const [filters, setFilters] = useState({ ...filterFields });
    const [limit, setLimit] = useState(20);


    const debouncedQuery_employee_id = useDebounce(filters.employee_id, 800);
    const debouncedQuery_to = useDebounce(filters.to, 800);
    const debouncedQuery_from = useDebounce(filters.from, 800);

    const { company } = useCompanyContext();
    const { addToast } = useToastContext();
    const location = useLocation();

    const handleFetchAbsences = useCallback(async () => {
        setIsAbsencesLoading(true);

        try {
            const result = await fetchAbsences(
                company.company_id,
                debouncedQuery_employee_id || null,
                debouncedQuery_from || null,
                debouncedQuery_to || null,
                limit,
            );
            setAbsences(result.data.absences);
        } catch (error) {
            console.log('error', error);
            addToast("Failed to fetch Absences", "error");
        }
        finally {
            setIsAbsencesLoading(false);
        }
    }, [company, debouncedQuery_employee_id, debouncedQuery_from, debouncedQuery_to, limit]);

    useEffect(() => {
        if (!company) return;

        if (location.pathname === '/attendance/absence') {
            handleFetchAbsences();
        }

    }, [location.pathname, handleFetchAbsences]);

    const handleShowAbsenceModal = () => {
        setShowAbsenceModal(!showAbsenceModal);
    }

    const handleRowClick = (data, row) => {
        console.log('clicked', data);
    };

    // Form data manipulation
    const handleAddRow = () => {
        const newRow = { ...formData, id: Date.now() };
        setAbsencesFormData(prev => [...prev, newRow]);
    };

    const handleRemoveRow = (id) => {
        if (absencesFormData.length > 1) {
            setAbsencesFormData(prev => prev.filter(row => row.id !== id));
        }
    };

    const handleFieldChange = (id, field, value) => {
        setAbsencesFormData(prev =>
            prev.map(row =>
                row.id === id ? { ...row, [field]: value } : row
            )
        );
    };

    const handleResetForm = () => {
        setAbsencesFormData([{ ...formData, id: Date.now() }]);
    };

    const handleAddAbsences = async () => {
        setIsAddAbsenceLoading(true);

        try {
            // Validate form-data
            const validAbsences = absencesFormData.filter(ab => ab.employee_id && ab.employee_id.trim() && ab.absence_date);

            if (validAbsences.length === 0) {
                addToast("Please provide employee id and absence date for each record", "error");
                return;
            }

            const failedAbsences = [];

            for (const ab of validAbsences) {
                try {
                    const cleaned = { ...ab };
                    delete cleaned.id;

                    await addOneAbsence(company.company_id, cleaned);
                    addToast(`Successfully added absence: ${ab.employee_id}`, "success");
                } catch (error) {
                    console.log(error);
                    addToast(`Error adding absence for employee: ${ab.employee_id}`, "error");
                    failedAbsences.push(ab);
                }
            }

            if (failedAbsences.length > 0) {
                setAbsencesFormData(failedAbsences);
                await handleFetchAbsences();
            }
            else {
                handleResetForm();
                await handleFetchAbsences();
                //close modal
                handleShowAbsenceModal();
            }
        } catch (error) {
            console.error('Error adding absences:', error);
            addToast("Failed to add absences", "error");
        }
        finally {
            setIsAddAbsenceLoading(false);
        }
    };

    const handleDeleteAbsence = async (rowData) => {
        try {
            await deleteOneAbsence(company.company_id, rowData.employee_absence_id);
            addToast("Records successfully deleted", "success");
            await handleFetchAbsences();
        } catch (error) {
            console.log(error);
            addToast(`Failed to delete record`, "error");
        }
    };

    // File uploading
    const mapFileDataToForm = (data) => {
        const validAbsenceTypes = [
            'SICK',
            'MATERNITY',
            'PATERNITY',
            'VACATION',
            'BEREAVEMENT',
            'PERSONAL',
            'EMERGENCY'
        ];

        const validAbsenceStatus = ['PENDING', 'ACCEPTED', 'REJECTED'];

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
                    // Handle absence_date (date field - YYYY-MM-DD)
                    else if (matchingField === "absence_date") {
                        const parsedDate = parseExcelDate(value);
                        mappedRow[matchingField] = formatDateToISO18601(parsedDate);
                    }
                    // Handle absence type enum
                    else if (matchingField === "absence_type") {
                        const absenceType = String(value).toUpperCase().trim();
                        mappedRow[matchingField] = validAbsenceTypes.includes(absenceType) ? absenceType : 'SICK';
                    }
                    // Handle absence status enum
                    else if (matchingField === "absence_status") {
                        const absenceStatus = String(value).toUpperCase().trim();
                        mappedRow[matchingField] = validAbsenceStatus.includes(absenceStatus) ? absenceStatus : 'PENDING';
                    }
                    // Handle is_paid (boolean)
                    else if (matchingField === "is_paid" || matchingField === "is_half_day") {
                        const boolValue = String(value).toLowerCase().trim();
                        mappedRow[matchingField] = ['true', '1', 'yes', 'y', 'paid'].includes(boolValue);
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

    const uploadAbsenceFile = async (file) => {
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

            const validData = mappedData.filter(row =>
                row.employee_id && row.employee_id.trim() &&
                row.absence_date
            );

            if (validData.length === 0) {
                addToast("No valid data found in the file. Please ensure employee_id and absence_date are provided.", "error");
                return;
            }

            // Update the form data
            setAbsencesFormData(validData);

            addToast(`Successfully loaded ${validData.length} absence record(s) from file`, "success");

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
        // State
        absences,
        setAbsences,
        absence,
        setAbsence,
        isAbsencesLoading,
        setIsAbsencesLoading,
        showAbsenceModal,
        setShowAbsenceModal,
        isUploading,
        isAddAbsenceLoading,

        // Data fetching
        handleFetchAbsences,

        // Form data
        absencesFormData,
        setAbsencesFormData,

        // Modal
        handleShowAbsenceModal,

        // Form manipulation
        handleAddRow,
        handleRemoveRow,
        handleFieldChange,
        handleResetForm,

        // CRUD operations
        handleAddAbsences,
        handleDeleteAbsence,

        // File upload
        uploadAbsenceFile,

        // Row click
        handleRowClick,

        //filter
        filters, setFilters,
        handleResetFilter, handleFilterChange,

        //pagination
        limit, setLimit
    };
};

export default useAbsence;