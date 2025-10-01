import { RocketLaunchIcon, ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import CompanySelection from "./CompanySelection";

const Sidebar = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    // State to track which sections are collapsed
    const [collapsedSections, setCollapsedSections] = useState(new Set());

    const toggleSection = (sectionIndex) => {
        const newCollapsed = new Set(collapsedSections);
        if (newCollapsed.has(sectionIndex)) {
            newCollapsed.delete(sectionIndex);
        } else {
            newCollapsed.add(sectionIndex);
        }
        setCollapsedSections(newCollapsed);
    };

    const navItemClasses = (path) =>
        `flex items-center gap-2 px-2 py-1 rounded-md transition-colors text-sm
     ${isActive(path)
            ? "text-teal-600 font-semibold bg-teal-50"
            : "text-gray-600 hover:text-teal-500 hover:bg-gray-50"
        }`;

    const sidebarSections = [
        {
            title: null,
            items: [{ label: "Dashboard", path: "/dashboard" }],
        },
        {
            title: null,
            items: [{ label: "Payrun", path: "/payrun" }],
        },
        // {
        //     title: "Payrun",
        //     items: [
        //         { label: "Payrun", path: "/payrun" },
        //         { label: "Regular Payrun", path: "/payrun/regular" },
        //         { label: "Last Payrun", path: "/payrun/last" },
        //         { label: "Special Payrun", path: "/payrun/special" },
        //     ],
        // },
        {
            title: null,
            items: [{ label: "Employee", path: "/employee" }],
        },
        {
            title: "Attendance",
            items: [
                { label: "Attendance", path: "/attendance" },
                { label: "Overtime", path: "/attendance/overtime" },
                { label: "Leave", path: "/attendance/leave" },
                { label: "Absence", path: "/attendance/absence" },
                { label: "Restday", path: "/attendance/restday" },
                { label: "Holiday", path: "/attendance/holiday" },
            ],
        },
        {
            title: "Configuration",
            items: [
                { label: "Payitems", path: "/configuration/payitem" },
                { label: "Recurring Pay", path: "/configuration/recurring-pay" },
                { label: "Comp. Config.", path: "/configuration/company-configuration" },
                { label: "Contributions", path: "/configuration/contribution" },
            ],
        },
    ];

    return (
        <aside className="w-52 bg-white border-r border-gray-200 min-h-screen p-4 flex flex-col">
            <CompanySelection />
            <nav className="flex flex-col pt-2 gap-y-1.5 text-sm">
                {sidebarSections.map((section, idx) => (
                    <div key={idx}>
                        {section.title && (
                            <button
                                onClick={() => toggleSection(idx)}
                                className="flex items-center justify-between w-full text-left text-[11px] font-semibold text-gray-400 uppercase mb-1 tracking-wide hover:text-gray-600 transition-colors py-1"
                            >
                                <span>{section.title}</span>
                                {collapsedSections.has(idx) ? (
                                    <ChevronRightIcon className="w-3 h-3" />
                                ) : (
                                    <ChevronDownIcon className="w-3 h-3" />
                                )}
                            </button>
                        )}

                        <div
                            className={`flex flex-col ${section.title ? "pl-4 border-l border-gray-200" : ""
                                } space-y-1 transition-all duration-200 ease-in-out ${section.title && collapsedSections.has(idx)
                                    ? "max-h-0 overflow-hidden opacity-0"
                                    : "max-h-96 opacity-100"
                                }`}
                        >
                            {section.items.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={navItemClasses(item.path)}
                                >
                                    {isActive(item.path) && (
                                        <RocketLaunchIcon className="w-3.5 h-3.5 text-teal-600 text-sm" />
                                    )}
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
