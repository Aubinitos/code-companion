import { NavLink, useLocation } from "react-router-dom";
import { Sun, LayoutDashboard, BarChart3, Wind, Settings, Download, Zap } from "lucide-react";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Tableau de bord" },
  { to: "/production", icon: Zap, label: "Production" },
  { to: "/pollution", icon: Wind, label: "Pollution" },
  { to: "/control", icon: Settings, label: "Pilotage" },
  { to: "/export", icon: Download, label: "Export" },
];

const AppSidebar = () => {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-border bg-sidebar">
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-border px-6 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-solar">
          <Sun className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground">Track My Sun</h1>
          <p className="text-xs text-muted-foreground font-mono">v1.0 — BTS CIEL</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-primary/10 text-primary glow-amber"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <item.icon className={`h-5 w-5 ${isActive ? "text-primary" : ""}`} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {/* Status */}
      <div className="border-t border-border px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
          <span className="text-xs text-muted-foreground">Système actif</span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground font-mono">Raspberry Pi 3 B+</p>
      </div>
    </aside>
  );
};

export default AppSidebar;
