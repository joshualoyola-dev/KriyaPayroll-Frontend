import { BanknotesIcon } from "@heroicons/react/24/solid";
import { usePayrunContext } from "../../../../contexts/PayrunProvider";
import PayrunFilter from "./PayrunFilter";
import PayrunCard from "./PayrunCard";
import DualBallLoading from "../../../../components/DualBallLoading";

const PayrunPage = () => {
    const { payruns, isPayrunLoading, handleClickPayrun, handleDeleteOnePayrun, deleteLoading, handleNavigateSendPayslip } = usePayrunContext();
    const regularPayruns = payruns.filter(payrun => payrun.payrun_type === 'REGULAR');
    const specialPayruns = payruns.filter(payrun => payrun.payrun_type === 'SPECIAL');
    const lastPayruns = payruns.filter(payrun => payrun.payrun_type === 'LAST');

    return (
        <div className="w-full max-w-full">
            <PayrunFilter />
            {
                isPayrunLoading
                    ? <DualBallLoading />
                    : <div className="flex flex-col pt-5 gap-y-3">
                        <div className="">
                            <span className="flex mb-1 text-sm font-semibold text-gray-600 gap-x-2">
                                <BanknotesIcon className="w-5 h-5 text-teal-600" />
                                <p> Regular Payrun</p>
                            </span>

                            <div className="space-y-3">
                                {regularPayruns?.map((payrun, idx) => (
                                    <PayrunCard
                                        key={idx}
                                        payrun={payrun}
                                        idx={idx}
                                        oncClickCard={handleClickPayrun}
                                        onDelete={handleDeleteOnePayrun}
                                        onNavigateSendPayslip={handleNavigateSendPayslip}
                                    />
                                ))}
                            </div>
                        </div>
                        <div>
                            <span className="flex text-sm font-semibold text-gray-600 gap-x-2">
                                <BanknotesIcon className="w-5 h-5 text-teal-600" />
                                <p> Special Payrun</p>
                            </span>
                            <div className="space-y-3">
                                {specialPayruns?.map((payrun, idx) => (
                                    <PayrunCard key={idx} payrun={payrun} idx={idx} oncClickCard={handleClickPayrun} />
                                ))}
                            </div>
                        </div>
                        <div>
                            <span className="flex text-sm font-semibold text-gray-600 gap-x-2">
                                <BanknotesIcon className="w-5 h-5 text-teal-600" />
                                <p> Last Payrun</p>
                            </span>
                            <div className="space-y-3">
                                {lastPayruns?.map((payrun, idx) => (
                                    <PayrunCard key={idx} payrun={payrun} idx={idx} oncClickCard={handleClickPayrun} />
                                ))}
                            </div>
                        </div>

                    </div>
            }
        </div>
    )
};

export default PayrunPage;