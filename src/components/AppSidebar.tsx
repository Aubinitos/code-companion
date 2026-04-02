import { NavLink, useLocation } from "react-router-dom";
import { Sun, LayoutDashboard, BarChart3, Wind, Settings, Download } from "lucide-react";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Tableau de bord" },
  { to: "/production", icon: BarChart3, label: "Production" },
  { to: "/pollution", icon: Wind, label: "Pollution" },
  { to: "/control", icon: Settings, label: "Pilotage" },
  { to: "/export", icon: Download, label: "Export" },
];

const AppSidebar = () => {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-56 flex-col border-r border-border bg-sidebar">
      <div className="flex items-center gap-2 border-b border-border px-4 py-4">
        <Sun className="h-6 w-6 text-accent" />
        <div>
          <h1 className="text-base font-bold text-foreground">Track My Sun</h1>
          <p className="text-xs text-muted-foreground">BTS CIEL</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-2 py-3">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink key={item.to} to={item.to}
              className={`flex items-center gap-2 rounded px-3 py-2 text-sm ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              }`}>
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-border px-3 py-3">
        <p className="text-xs text-muted-foreground">● Système actif</p>
        <p className="text-xs text-muted-foreground">Raspberry Pi 3 B+</p>
      </div>
    </aside>
  );
};

export default AppSidebar;
