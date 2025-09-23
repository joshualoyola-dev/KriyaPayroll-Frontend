import { useWithholdingContext } from "../../../../contexts/WithholdingProvider";
import ContributionTable from "./ContributionTable";

const WithholdingSection = () => {
    const { withholdings, handleUpdateWithholding } = useWithholdingContext();

    const columns = [
        'frequency',
        'bracket_number',
        'min_compensation',
        'max_compensation',
        'base_tax',
        'percent_over',
        'excess_over',
    ];

    // Define which columns can be edited
    const editableColumns = [
        'frequency',
        'bracket_number',
        'min_compensation',
        'max_compensation',
        'base_tax',
        'percent_over',
        'excess_over',
    ];

    return (
        <div className="pt-5">
            <ContributionTable
                data={withholdings}
                columns={columns}
                editableColumns={editableColumns}
                keyField="withholding_tax_id"
                onEdit={handleUpdateWithholding}
            />
        </div>
    )
};
export default WithholdingSection;