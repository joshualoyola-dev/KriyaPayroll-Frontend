import { useUploadPayrunContext } from "../../../../contexts/UploadPayrunProvider";
import OptionUpload from "../shared-component/OptionUpload";
import PayslipTable from "../shared-component/PayslipTable";

const UploadPayrunPage = () => {
    const { payslipsPayables, setPayslipsPayables } = useUploadPayrunContext();
    return (
        <>
            <div className="pb-4">
                <OptionUpload />
            </div>
            <div className="overflow-x-auto">
                {payslipsPayables.length === 0
                    ? <div></div>
                    : <PayslipTable data={payslipsPayables} setData={setPayslipsPayables} />
                }
            </div>
        </>
    );
};

export default UploadPayrunPage;