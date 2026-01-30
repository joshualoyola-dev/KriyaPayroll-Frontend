// export default useEmployee;
import { useCallback, useEffect, useMemo, useState } from "react";
import { useCompanyContext } from "../contexts/CompanyProvider";
import { addEmployeeSalary, createEmployee, fetchEmployeeById, fetchEmployeesByCompanyId, fetchEmployeesByCompanyIdAndQuery, updateEmployeeInfo, updateEmploymentStatus } from "../services/employee.service";
import { useToastContext } from "../contexts/ToastProvider";
import useDebounce from "./useDebounce";
import * as XLSX from 'xlsx';
import { convertExcelTimeToHHMM } from "../utility/excel.utility";
import { useLocation } from "react-router-dom";
import { formatToISODate } from "../utility/datetime.utility";
import { validateEmployeeData } from "../validations/employee.validation";

const formData = {
    employee_id: '',
    first_name: '',
    middle_name: null,
    last_name: '',
    personal_email: '',
    work_email: '',
    job_title: '',
    department: '',
    employement_status: true, // boolean instead of string

    date_hired: null, // Changed: Use null instead of empty string for consistent date handling
    date_end: null, // nullable

    shift_start: '', //YY:MM
    shift_end: '', //YY:MM
    break_start: '', //YY:MM
    break_end: '', //YY:MM
    shift_hours: '', //number

    base_pay: null, // nullable number
    date: null, // nullable date - for salary start date
    change_type: '',
    is_active: true,

};

const updateFormData = {
    employee_id: '',
    first_name: '',
    middle_name: null,
    last_name: '',
    personal_email: '',
    work_email: '',
    job_title: '',
    department: '',
    employement_status: true,

    date_hired: null,
    date_end: null,
}



const useEmployee = () => {
    const { company } = useCompanyContext();
    const [employees, setEmployees] = useState([]);
    const [employee, setEmployee] = useState();
    const [isEmployeesLoading, setIsEmployeesLoading] = useState(false);
    const [isEmployeeLoading, setIsEmployeeLoading] = useState();
    const [query, setQuery] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [showAddSalaryForm, setShowAddSalaryForm] = useState(false);
    const [isAddSalaryLoading, setIsAddSalaryLoading] = useState(false);
    const [isAddEmployeeLoading, setIsAddEmployeeLoading] = useState(false);
    const [activeEmployees, setActiveEmployees] = useState([]);
    const [isEditEmployee, setIsEditEmployee] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const { addToast } = useToastContext();
    const debouncedQuery = useDebounce(query, 800);
    const location = useLocation();

    const employeeIdToEmployeeMap = useMemo(() => {
        const map = new Map();

        for (const emp of employees) {
            map.set(emp.employee_id, `${emp.first_name} ${emp.last_name}`);
        }


        return map;
    }, [employees]);

    // Fix: Use useState correctly for employeesFormData
    const [employeesFormData, setEmployeesFormData] = useState([
        { ...formData, id: Date.now() } // Add unique id for each row
    ]);
    const [employeeUpdateFormData, setEmployeeUpdateFormData] = useState({ ...updateFormData });

    const [salaryFormData, setSalaryFormData] = useState({ ...formData });

    const fetchEmployees = useCallback(async () => {
        if (!employees.length) setIsEmployeesLoading(true);
        try {
            let result;
            if (debouncedQuery && debouncedQuery.trim() !== "") {
                result = await fetchEmployeesByCompanyIdAndQuery(company.company_id, debouncedQuery);
            } else {
                result = await fetchEmployeesByCompanyId(company.company_id);
            }

            setEmployees(result.data.employees);
        } catch (error) {
            console.error(error);
            addToast("Failed to fetch employees", "error");
        } finally {
            setIsEmployeesLoading(false);
        }
    }, [company, debouncedQuery]);

    useEffect(() => {
        if (!company) return;
        fetchEmployees();
    }, [fetchEmployees]);

    useEffect(() => {
        if (!employees) return;

        setActiveEmployees(employees.filter(e => e.employement_status));
    }, [employees]);

    const handleReloadEmployees = async () => {
        try {
            const result = await fetchEmployeesByCompanyId(company.company_id);
            setEmployees(result.data.employees);
        } catch (error) {
            console.error(error);
            addToast("Failed to fetch employees", "error");
        }
    }

    const handleFetchEmployeeInfo = async (employee_id) => {
        setIsEmployeeLoading(true);
        try {
            const result = await fetchEmployeeById(company.company_id, employee_id);
            setEmployee(result.data.employee);
            setEmployeeUpdateFormData({
                employee_id: result.data.employee.employee_id,
                first_name: result.data.employee.first_name,
                middle_name: result.data.employee.middle_name,
                last_name: result.data.employee.last_name,
                personal_email: result.data.employee.personal_email,
                work_email: result.data.employee.work_email,
                job_title: result.data.employee.job_title,
                department: result.data.employee.department,
                employement_status: result.data.employee.employement_status,

                date_hired: result.data.employee.date_hired,
                date_end: result.data.employee.date_end,
            });
        } catch (error) {
            console.log('error', error);
            addToast("Failed to fetch employee information", error);
        } finally {
            setIsEmployeeLoading(false);
        }
    };

    const handleShowAddModal = (val) => {
        setShowAddModal(val);
    };

    // Form manipulation functions
    const handleAddRow = () => {
        const newRow = { ...formData, id: Date.now() };
        setEmployeesFormData(prev => [...prev, newRow]);
    };

    const handleRemoveRow = (id) => {
        if (employeesFormData.length > 1) {
            setEmployeesFormData(prev => prev.filter(row => row.id !== id));
        }
    };

    const handleFieldChange = (id, field, value) => {
        setEmployeesFormData(prev =>
            prev.map(row => {
                if (row.id === id) {
                    // Handle date fields specially to ensure ISO format
                    if (['date_hired', 'date_end', 'date'].includes(field)) {
                        return { ...row, [field]: formatToISODate(value) };
                    }
                    return { ...row, [field]: value };
                }
                return row;
            })
        );
    };

    const handleResetForm = () => {
        setEmployeesFormData([{ ...formData, id: Date.now() }]);
    };

    const handleAddEmployees = async () => {
        setIsAddEmployeeLoading(true);
        try {
            // Enhanced validation
            const validationResults = employeesFormData.map((emp, index) => ({
                employee: emp,
                index,
                errors: validateEmployeeData(emp)
            }));

            // Filter out employees with validation errors
            const validEmployees = validationResults.filter(result => result.errors.length === 0);
            const invalidEmployees = validationResults.filter(result => result.errors.length > 0);

            // Show validation errors
            if (invalidEmployees.length > 0) {
                invalidEmployees.forEach(result => {
                    addToast(`Row ${result.index + 1}: ${result.errors.join(', ')}`, "error");
                });
            }

            if (validEmployees.length === 0) {
                addToast("Please fix validation errors before submitting", "error");
                return;
            }

            const failedEmployees = [];

            for (const result of validEmployees) {
                try {
                    // Ensure all dates are in ISO format before sending
                    const employeeData = {
                        ...result.employee,
                        date_hired: formatToISODate(result.employee.date_hired),
                        date_end: formatToISODate(result.employee.date_end),
                        date: formatToISODate(result.employee.date),
                    };

                    await createEmployee(company.company_id, employeeData);
                    addToast(`Successfully added employee: ${result.employee.first_name} ${result.employee.last_name}`, "success");
                } catch (error) {
                    console.error('Error adding employee:', error);
                    addToast(`Error adding employee: ${result.employee.first_name} ${result.employee.last_name}`, "error");
                    failedEmployees.push(result.employee);
                }
            }



            // Update the form with only failed employees
            if (failedEmployees.length > 0) {
                setEmployeesFormData(failedEmployees.map((emp, index) => ({ ...emp, id: Date.now() + index })));
            } else {
                // reset form if all succeeded
                handleResetForm();
                //close modal 
                handleShowAddModal();
            }

            //reload employees
            await handleReloadEmployees();
        } catch (error) {
            console.error('Error adding employees:', error);
            addToast("Failed to add employees", "error");
        }
        finally {
            setIsAddEmployeeLoading(false);
        }
    };

    const normalizeHeader = (header) => {
        return header
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '_')
            .replace(/[^\w]/g, '');
    };

    // Helper function to convert string boolean values to actual booleans
    const convertToBoolean = (value) => {
        if (typeof value === "boolean") return value;
        if (typeof value === "string") {
            const lowerValue = value.toLowerCase().trim();
            if (lowerValue === "true" || lowerValue === "1" || lowerValue === "yes") return true;
            if (lowerValue === "false" || lowerValue === "0" || lowerValue === "no") return false;
        }
        if (typeof value === "number") {
            return value === 1;
        }
        return value;
    };

    // Updated mapFileDataToForm function with time handling
    const mapFileDataToForm = (data) => {
        return data.map((row, index) => {
            const mappedRow = { ...formData, id: Date.now() + index };

            // Get valid form keys
            const formKeys = Object.keys(formData);
            const timeFields = ['shift_start', 'shift_end', 'break_start', 'break_end'];

            Object.entries(row).forEach(([key, value]) => {
                const normalizedKey = normalizeHeader(key);

                // Find matching form field
                const matchingField = formKeys.find(
                    (formKey) => normalizeHeader(formKey) === normalizedKey
                );

                if (matchingField && value !== null && value !== undefined && value !== "") {
                    // Handle time fields (convert Excel decimals to HH:MM)
                    if (timeFields.includes(matchingField)) {
                        mappedRow[matchingField] = convertExcelTimeToHHMM(value);
                    }
                    // Handle base_pay (must be number)
                    else if (matchingField === "base_pay") {
                        mappedRow[matchingField] = Number(value) || null;
                    }
                    // Handle shift_hours (must be number)
                    else if (matchingField === "shift_hours") {
                        mappedRow[matchingField] = Number(value) || '';
                    }
                    // Handle date fields (must be string `YYYY-MM-DD` for <input type="date">)
                    else if (
                        ["date_hired", "date_end", "date"].includes(matchingField)
                    ) {
                        // Excel sometimes gives numbers (serials), sometimes strings
                        if (typeof value === "number") {
                            // Convert Excel serial to JS Date
                            const excelDate = XLSX.SSF.parse_date_code(value);
                            if (excelDate) {
                                const jsDate = new Date(
                                    excelDate.y,
                                    excelDate.m - 1,
                                    excelDate.d
                                );
                                mappedRow[matchingField] = formatToISODate(jsDate);
                            } else {
                                mappedRow[matchingField] = null;
                            }
                        } else if (typeof value === "string" && value.trim()) {
                            mappedRow[matchingField] = formatToISODate(value);
                        } else {
                            mappedRow[matchingField] = null;
                        }
                    }
                    // Handle boolean fields specifically
                    else if (
                        ["employement_status", "is_active"].includes(matchingField)
                    ) {
                        mappedRow[matchingField] = convertToBoolean(value);
                    }
                    // Handle other booleans
                    else if (typeof value === "boolean") {
                        mappedRow[matchingField] = value;
                    }
                    // Everything else (strings, text fields)
                    else {
                        mappedRow[matchingField] = String(value).trim();
                    }
                }
            });

            return mappedRow;
        });
    };

    // Parse Excel file
    const parseExcelFile = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });

                    // Get first worksheet
                    const worksheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[worksheetName];

                    // Convert to JSON with headers
                    const jsonData = XLSX.utils.sheet_to_json(worksheet, {
                        header: 1,
                        defval: '',
                        blankrows: false
                    });

                    if (jsonData.length === 0) {
                        reject(new Error('No data found in the Excel file'));
                        return;
                    }

                    // Convert array format to object format
                    const headers = jsonData[0];
                    const rows = jsonData.slice(1).map(row => {
                        const obj = {};
                        headers.forEach((header, index) => {
                            obj[header] = row[index] || '';
                        });
                        return obj;
                    });

                    resolve(rows);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsArrayBuffer(file);
        });
    };

    const uploadEmployeeFile = async (file) => {
        if (!file) {
            addToast("Please select a file", "error");
            return;
        }

        const fileExtension = file.name.split('.').pop().toLowerCase();

        if (!['xlsx', 'xls'].includes(fileExtension)) {
            addToast("Please upload a CSV or Excel file", "error");
            return;
        }

        setIsUploading(true);

        try {
            let parsedData = [];

            if (fileExtension === 'xlsx' || fileExtension === 'xls') {
                parsedData = await parseExcelFile(file);
            }

            if (parsedData.length === 0) {
                addToast("No data found in the file", "error");
                return;
            }

            // Map the data to form structure
            const mappedData = mapFileDataToForm(parsedData);

            // Filter out completely empty rows
            const validData = mappedData.filter(row =>
                Object.values(row).some(value =>
                    value !== '' && value !== null && value !== undefined && value !== 'id'
                )
            );

            if (validData.length === 0) {
                addToast("No valid employee data found in the file", "error");
                return;
            }

            // Update the form data
            setEmployeesFormData(validData);

            addToast(`Successfully loaded ${validData.length} employee(s) from file`, "success");

        } catch (error) {
            console.error('File upload error:', error);
            addToast(`Failed to process file: ${error.message}`, "error");
        } finally {
            setIsUploading(false);
        }
    };

    const handleResetEmployeeSalaryForm = () => {
        setSalaryFormData({ ...formData });
    }

    const handleAddSalary = async () => {
        setIsAddSalaryLoading(true);
        setSalaryFormData({ ...salaryFormData, employee_id: employee.employee_id });

        const payload = {
            ...salaryFormData,
            employee_id: employee.employee_id,
            company_id: company.company_id,
            base_pay: Number(salaryFormData.base_pay),
            date: formatToISODate(salaryFormData.date), // Ensure ISO format
        }

        try {
            await addEmployeeSalary(company.company_id, employee.employee_id, payload);
            addToast("New salary added", "success");

            //trigger fetch of employeeInfo
            await handleFetchEmployeeInfo(employee.employee_id);

            //reset form
            handleResetEmployeeSalaryForm();

            //close form
            setShowAddSalaryForm(false);
        } catch (error) {
            console.log(error);
            addToast("Failed to add new salary", "error");
        }
        finally {
            setIsAddSalaryLoading(false);
        }
    }

    const handleChangeEmploymentStatus = async () => {
        try {
            const result = await updateEmploymentStatus(company.company_id, employee.employee_id, !employee.employement_status);
            console.log('result', result);

            addToast("Employment status updated successfully", "success");

            //trigger fetch of employeeInfo
            await handleFetchEmployeeInfo(employee.employee_id);

            //trigger fetch of employees to update tables
            await handleReloadEmployees();
        } catch (error) {
            console.log(error);
            addToast("Failed to update employment status", "error");
        }
    }


    const mapEmployeeIdToEmployeeName = useCallback((employee_id) => {
        return employeeIdToEmployeeMap.get(employee_id) ?? "N/A";
    }, [employeeIdToEmployeeMap])

    const toggleEdit = () => {
        setIsEditEmployee(!isEditEmployee);
    };

    const updateEmployeeInformation = async () => {
        setIsUpdating(true);
        try {
            const payload = {
                ...employeeUpdateFormData,
                employement_status: employeeUpdateFormData.employement_status,
                date_hired: formatToISODate(employeeUpdateFormData.date_hired),
                date_end: employeeUpdateFormData.date_end ? formatToISODate(employeeUpdateFormData.date_end) : null,
            };

            const response = await updateEmployeeInfo(company.company_id, payload.employee_id, payload);
            console.log('updated employee info: ', response);

            //then reset form
            setEmployeeUpdateFormData({ ...updateFormData });

            //call refetch
            handleFetchEmployeeInfo(employee.employee_id);

            //trigger fetch of employees to update tables
            await handleReloadEmployees();

            setIsEditEmployee(false);
        } catch (error) {
            console.log(error);
            addToast("Failed to update the employee information", "error");
        }
        finally {
            setIsUpdating(false);
        }
    };

    return {
        employees, setEmployees,
        employee, setEmployee,
        isEmployeesLoading, setIsEmployeesLoading,
        isEmployeeLoading, setIsEmployeeLoading,
        handleFetchEmployeeInfo,
        query, setQuery,
        handleShowAddModal,
        showAddModal, setShowAddModal,
        employeesFormData, setEmployeesFormData,
        isUploading,

        //for payrun
        activeEmployees, setActiveEmployees,

        // Form manipulation functions
        handleAddRow,
        handleRemoveRow,
        handleFieldChange,
        handleResetForm,
        handleAddEmployees,
        uploadEmployeeFile,
        isAddEmployeeLoading, setIsAddEmployeeLoading,

        //salary
        showAddSalaryForm, setShowAddSalaryForm,
        salaryFormData, setSalaryFormData,
        handleAddSalary,
        isAddSalaryLoading, setIsAddSalaryLoading,
        handleChangeEmploymentStatus,

        mapEmployeeIdToEmployeeName,

        isEditEmployee, setIsEditEmployee,
        toggleEdit,

        employeeUpdateFormData, setEmployeeUpdateFormData,
        updateEmployeeInformation,
        isUpdating, setIsUpdating
    };
};

export default useEmployee;