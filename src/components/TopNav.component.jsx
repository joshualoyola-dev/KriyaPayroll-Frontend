import { BellIcon, ChevronDownIcon } from "@heroicons/react/16/solid";
import { useLocation } from "react-router-dom";
import useTopNav from "../hooks/useTopNav";
import { useUserContext } from "../contexts/UserProvider";
import { generateInitials } from "../utility/name.utility";

const TopNav = () => {
    const { user, loading } = useUserContext();
    const { dropdownOpen, setDropdownOpen, handleLogout, paths } = useTopNav();
    const location = useLocation();
    const pathname = location.pathname;

    if (loading) {
        return (
            <nav className="w-full pl-6 pr-12 pt-6 pb-3 flex justify-between h-[10vh]">
                {/* Left side skeleton (page title) */}
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>

                {/* Right side skeleton */}
                <div className="flex gap-6 items-center">
                    {/* Notification icon skeleton */}
                    <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse"></div>

                    {/* User info skeleton */}
                    <div className="flex items-center gap-2">
                        {/* Avatar */}
                        <div className="h-9 w-9 rounded-full bg-gray-200 animate-pulse"></div>

                        {/* Name & role */}
                        <div className="hidden sm:block text-right space-y-1">
                            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
                        </div>

                        {/* Dropdown icon skeleton */}
                        <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                </div>
            </nav>
        );
    }

    if (!user) {
        return (
            <nav className="w-full pl-6 pr-12 pt-6 pb-3 flex justify-between h-[10vh]">
                <div>User not found</div>
            </nav>
        );
    }



    return (
        <nav className="w-full pl-6 pr-12 pt-6 pb-3 flex justify-between h-[10vh]">
            <div className="font-extrabold ">
                {paths[pathname]}
            </div>

            <div className="flex  gap-6">
                {/* Notifications */}
                <button className="relative focus:outline-none">
                    <BellIcon className="h-5 w-5 text-gray-400 hover:text-gray-700 transition" />
                </button>

                {/* User Info & Dropdown */}
                <div className="relative flex items-center gap-2 cursor-pointer">
                    {/* Avatar */}
                    <div className="h-9 w-9 rounded-full bg-teal-600 flex items-center justify-center text-white font-semibold">
                        {generateInitials(user.first_name, user.last_name)}
                    </div>
                    {/* Name & Role */}
                    {/* Name & Role */}
                    <div className="hidden sm:block text-right max-w-[150px]">
                        <p className="text-sm font-semibold truncate">
                            {user.first_name} {user.last_name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                            {user.job_title}
                        </p>
                    </div>


                    {/* Dropdown Toggle */}
                    <button onClick={() => setDropdownOpen(!dropdownOpen)}>
                        <ChevronDownIcon
                            className={`h-4 w-4 text-gray-600 transform transition-transform duration-300 ${dropdownOpen ? "rotate-180" : "rotate-0"
                                }`}
                        />
                    </button>

                    {/* Dropdown Menu */}
                    {dropdownOpen && (
                        <div className="absolute right-0 top-12 w-40 bg-white border border-gray-300 rounded-lg z-20">
                            <button
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 rounded-t-xl"
                            >
                                Profile
                            </button>
                            <button
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 rounded-t-xl hover:bg-teal-100"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default TopNav;

