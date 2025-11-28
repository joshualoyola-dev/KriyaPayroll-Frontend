import Sidebar from "../components/Sidebar.component";
import { Outlet } from "react-router-dom";
import TopNav from "../components/TopNav.component";

const MainLayout = () => {
    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex flex-col flex-1 min-w-0 min-h-0">
                <TopNav />
                <main className="flex-1 p-6 bg-gray-100 overflow-y-auto overflow-x-hidden">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
