import { useSssContext } from "../../../../contexts/SssProvider";
import ContributionTable from "./ContributionTable";

const SSSSection = () => {
    const { ssss, handleUpdateSss } = useSssContext();



    const columns = [
        'salary_min',
        'salary_max',
        'employeer_regular_ss',
        'employeer_regular_mpf',
        'employeer_regular_ec',

        'employee_regular_ss',
        'employee_regular_mpf',

        'effective_date_start',
        'effective_date_end'
    ];

    // Define which columns can be edited
    const editableColumns = [
        'salary_min',
        'salary_max',
        'employeer_regular_ss',
        'employeer_regular_mpf',
        'employeer_regular_ec',

        'employee_regular_ss',
        'employee_regular_mpf',

        'effective_date_start',
        'effective_date_end'
    ];

    return (
        <div className="pt-5">
            <ContributionTable
                data={ssss}
                columns={columns}
                editableColumns={editableColumns}
                keyField="sss_contribution_rate_id"
                onEdit={handleUpdateSss}
            />
        </div>
    )
};
export default SSSSection;