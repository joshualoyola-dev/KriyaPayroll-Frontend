import { useContributionContext } from "../../../../contexts/ContributionProvider";
import ContributionTab from "./ContributionTab";
import SSSSection from "./SSSSection";
import PHICSection from "./PHICSection";
import HDMFSection from "./HDMFSection";
import WithholdingSection from "./WithholdingSection";
import { userHasFeatureAccess } from "../../../../utility/access-controll.utility";
import env from "../../../../configs/env.config";
import NoAccess from "../../../../components/NoAccess";

const ContributionPage = () => {
    const { selectedTab } = useContributionContext();

    let activeSection;

    if (selectedTab.id === "sss") {
        activeSection = <SSSSection />
    }
    else if (selectedTab.id === "phic") {
        activeSection = <PHICSection />
    }
    else if (selectedTab.id === "hdmf") {
        activeSection = <HDMFSection />
    }
    else {
        activeSection = <WithholdingSection />
    }

    const hasAccess = userHasFeatureAccess(env.VITE_PAYROLL_CONFIGURE_CONTRIBUTIONS_SETTING);
    if (!hasAccess) {
        return <NoAccess title={'Unauthorized'} label={'You are not allowed to access this resource'} />
    }

    return (
        <>
            <div className="flex flex-col pb-4">
                <ContributionTab />
                {activeSection}
            </div>
        </>
    );
};

export default ContributionPage;