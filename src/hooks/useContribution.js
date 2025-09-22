import { useState } from "react";

const useContribution = () => {
    const tabs = [
        { id: "sss", name: "SSS Contribution Table" },
        { id: "phic", name: "PHIC Contribution Table" },
        { id: "hdmf", name: "HDMF Contributionn Table" },
        { id: "withholding", name: "Withholding Tax Table" },
    ]
    const [selectedTab, setSelectedTabs] = useState(tabs[0]);

    const handleChangeSelectedTab = (tab) => {
        setSelectedTabs(tab);
    };

    return {
        tabs,
        selectedTab, setSelectedTabs,
        handleChangeSelectedTab,
    };
};

export default useContribution;