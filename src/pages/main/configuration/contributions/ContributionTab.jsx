import { useContributionContext } from "../../../../contexts/ContributionProvider";

const ContributionTab = () => {
    const { tabs, selectedTab, handleChangeSelectedTab } = useContributionContext();

    return (
        <div className="flex w-full items-center gap-2 rounded-2xl bg-white p-1 border border-gray-200">
            {tabs.map((tab, idx) => {
                const isActive = selectedTab.id === tab.id;
                return (
                    <button
                        key={idx}
                        onClick={() => handleChangeSelectedTab(tab)}
                        className={`flex-1 rounded-xl px-4 py-0.5 text-sm font-medium transition-colors hover:cursor-pointer
              ${isActive
                                ? "bg-teal-600 text-white"
                                : "text-gray-600 hover:bg-gray-100"
                            }`}
                    >
                        {tab.name}
                    </button>
                );
            })}
        </div>
    );
};

export default ContributionTab;
