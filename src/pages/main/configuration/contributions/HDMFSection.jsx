
import { useHdmfContext } from "../../../../contexts/HdmfProvider";
import ContributionTable from "./ContributionTable";

const HDMFSection = () => {
    const { hdmfs, handleUpdateHdmf } = useHdmfContext();

    const columns = [
        'hdmf_contribution_rate_id',
        'total_rate',
        'employer_rate',
        'employee_rate',
        'effective_date_start',
        'effective_date_end'
    ];

    // Define which columns can be edited
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
                data={hdmfs}
                columns={columns}
                editableColumns={editableColumns}
                keyField="hdmf_contribution_rate_id"
                onEdit={handleUpdateHdmf}
            />
        </div>
    );
};

export default HDMFSection;
