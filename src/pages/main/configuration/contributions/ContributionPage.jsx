import { useContributionContext } from "../../../../contexts/ContributionProvider";
import ContributionTab from "./ContributionTab";
import SSSSection from "./SSSSection";
import PHICSection from "./PHICSection";
import HDMFSection from "./HDMFSection";
import WithholdingSection from "./WithholdingSection";

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