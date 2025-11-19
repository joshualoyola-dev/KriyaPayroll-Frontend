import { useUploadPayrunContext } from "../../../../contexts/UploadPayrunProvider";
import OptionUpload from "../shared-component/OptionUpload";

const UploadPayrunPage = () => {
    const { payslips, setPayslips } = useUploadPayrunContext();
    return (
        <>
            <div className="pb-4">
                <OptionUpload />
            </div>
            <div className="overflow-x-auto">
                {payslips.length === 0
                    ? <div></div>
                    : <PayslipTable data={payslips} setData={setPayslips} />
                }
            </div>
        </>
    );
};

export default UploadPayrunPage;