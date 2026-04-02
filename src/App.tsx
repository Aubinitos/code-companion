import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Production from "./pages/Production";
import Pollution from "./pages/Pollution";
import PanelControl from "./pages/PanelControl";
import ExportData from "./pages/ExportData";

const nav = [
  { to: "/", label: "Accueil" },
  { to: "/production", label: "Production" },
  { to: "/pollution", label: "Pollution" },
  { to: "/control", label: "Pilotage" },
  { to: "/export", label: "Export" },
];

const App = () => (
  <BrowserRouter>
    <div className="min-h-screen">
      <header className="border-b p-4">
        <h1 className="text-xl font-bold">Track My Sun - BTS CIEL</h1>
        <nav className="mt-2 flex gap-4">
          {nav.map(n => (
            <NavLink key={n.to} to={n.to} className={({ isActive }) =>
              isActive ? "font-bold text-blue-600" : "text-gray-600 hover:underline"
            }>{n.label}</NavLink>
          ))}
        </nav>
      </header>
      <main className="p-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/production" element={<Production />} />
          <Route path="/pollution" element={<Pollution />} />
          <Route path="/control" element={<PanelControl />} />
          <Route path="/export" element={<ExportData />} />
        </Routes>
      </main>
    </div>
  </BrowserRouter>
);

export default App;
