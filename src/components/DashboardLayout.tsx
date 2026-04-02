import { Outlet } from "react-router-dom";
import AppSidebar from "./AppSidebar";

const DashboardLayout = () => (
  <div className="flex min-h-screen bg-background">
    <AppSidebar />
    <main className="ml-56 flex-1 p-6">
      <Outlet />
    </main>
  </div>
);

export default DashboardLayout;
