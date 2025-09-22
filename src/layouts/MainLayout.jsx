import Sidebar from "../components/Sidebar.component";
import { Outlet } from "react-router-dom";
import TopNav from "../components/TopNav.component";

const MainLayout = () => {
    return (
        <div className="flex min-h-screen ">
            <Sidebar />
            <div className="flex flex-col flex-1">
                <TopNav />
                <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
                    <Outlet />
                </main>

            </div>
        </div>
    );
};

export default MainLayout;