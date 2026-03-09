
import LoadingBackground from "../../../../components/LoadingBackground";
import { useSharedRunningPayrunOperationContext } from "../../../../contexts/SharedRunningPayrunOperationProvider";
import OptionEdit from "../shared-component/OptionEdit";
import OptionGenerate from "../shared-component/OptionGenerate";
import PayslipTable from "../shared-component/PayslipTable";
import PayrunTabs from "../shared-component/PayrunTabs";
import BonusesYtdPanel from "../payrun/BonusesYtdPanel";

const SpecialPayrunPage = () => {
    const {
        payslips, setPayslips, payrun, payslipsLoading, isSaving, statusLoading, isInitializing, payslipsTotal,
        isBonusesLoading,
        bonusesData,
        bonusesForm,
        handleBonusesFormChange,
        handleBonusesStatusToggle,
        handleFetchBonuses,
    } = useSharedRunningPayrunOperationContext();

    const tabs = [
        {
            key: "payslip",
            label: "Payslip Table",
            content: (
                <div className="overflow-x-auto">
                    {payslips.length === 0
                        ? <div></div>
                        : <PayslipTable data={payslips} setData={setPayslips} totals={payslipsTotal} />
                    }
                </div>
            ),
        },
        {
            key: "bonuses",
            label: "Bonuses & Benefits YTD",
            content: (
                <BonusesYtdPanel
                    isOpen={true}
                    isLoading={isBonusesLoading}
                    data={bonusesData}
                    form={bonusesForm}
                    handleFormChange={handleBonusesFormChange}
                    handleStatusToggle={handleBonusesStatusToggle}
                    handleFetch={handleFetchBonuses}
                />
            ),
        },
    ];

    return (
        <>
            <div className="pb-4">
                {!payrun ? <OptionGenerate /> : <OptionEdit />}
            </div>

            {payrun && <PayrunTabs tabs={tabs} />}

            {/* No payrun yet — show payslip area without tabs */}
            {!payrun && (
                <div className="overflow-x-auto">
                    {payslips.length === 0
                        ? <div></div>
                        : <PayslipTable data={payslips} setData={setPayslips} totals={payslipsTotal} />
                    }
                </div>
            )}

            {(payslipsLoading || isSaving || statusLoading || isInitializing) && <LoadingBackground />}
        </>
    );
};

export default SpecialPayrunPage;