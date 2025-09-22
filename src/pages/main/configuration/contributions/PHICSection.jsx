import { usePhicContext } from "../../../../contexts/PhicProvider";
import ContributionTable from "./ContributionTable";

const PHICSection = () => {
    const { phics, handleUpdatePhic } = usePhicContext();

    const columns = [
        'phic_contribution_rate_id',
        'total_rate',
        'employer_rate',
        'employee_rate',
        'effective_date_start',
        'effective_date_end'
    ];

    const editableColumns = [
        'total_rate',
        'employer_rate',
        'employee_rate',
        'effective_date_start',
        'effective_date_end'
    ];


    return (
        <div className="pt-5">
            <ContributionTable
                data={phics}
                columns={columns}
                editableColumns={editableColumns}
                keyField="phic_contribution_rate_id"
                onEdit={handleUpdatePhic}
            />
        </div>
    )
};
export default PHICSection;