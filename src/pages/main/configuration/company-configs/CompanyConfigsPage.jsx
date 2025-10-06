import { PencilIcon } from "@heroicons/react/24/solid";
import { useCompanyContext } from "../../../../contexts/CompanyProvider";

const CompanyConfigsPage = () => {
    const { workingDays, payrollFrequency, ndRate, restdayRate, regularOTRate } = useCompanyContext();

    const configs = [
        {
            name: "Working Days",
            value: workingDays,
            description: "Number of working days in a week.",
        },
        {
            name: "Payroll Frequency",
            value: payrollFrequency,
            description: "How often payroll is processed.",
        },
        {
            name: "Regular Overtime Rate",
            value: regularOTRate,
            description: "Rate of regular overtime. Must be atleast 125% of hourly rate.",
        },
        {
            name: "Restday Rate",
            value: restdayRate,
            description: "Rate of pay on restday. Must be atleast 130%",
        },
        {
            name: "Night Differential Rate",
            value: ndRate,
            description: "Rate of Nigh differential, i.e., hours between 10pm-6am. Must be 10% of hourly rate",
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
            {configs.map((config) => (
                <div
                    key={config.name}
                    className="bg-white rounded-2xl p-6 flex flex-col justify-between"
                >
                    <div>
                        <h2 className="text-sm font-bold text-gray-800 flex items-center justify-between">
                            {config.name}
                            <button className="text-gray-500 hover:text-gray-700">
                                <PencilIcon className="w-4 h-4" />
                            </button>
                        </h2>
                        <p className="text-sm font-semibold text-gray-900 mt-2">
                            {config.value}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{config.description}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CompanyConfigsPage;
