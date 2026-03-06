import { useState } from "react";

/**
 * PayrunTabs
 *
 * Props:
 *  - tabs: Array<{ key: string, label: string, content: ReactNode }>
 *  - defaultTab?: string  — key of the tab to activate by default (falls back to first tab)
 */
const PayrunTabs = ({ tabs, defaultTab }) => {
    const [activeTab, setActiveTab] = useState(defaultTab ?? tabs[0]?.key);

    const activeContent = tabs.find(t => t.key === activeTab)?.content;

    return (
        <div>
            <div className="flex border-b border-gray-200 mb-4">
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-5 py-2 text-sm font-medium transition-all border-b-2 -mb-px ${
                            activeTab === tab.key
                                ? "border-teal-600 text-teal-700"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div>{activeContent}</div>
        </div>
    );
};

export default PayrunTabs;
