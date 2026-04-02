import { useState, useEffect } from "react";
import { generateCurrentReadings, generateHistoricalData, getSystemStatus } from "@/lib/mockData";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const tabs = ["Accueil", "Production", "Pollution", "Pilotage", "Export"];

const PeriodButtons = ({ period, setPeriod }: { period: number; setPeriod: (p: number) => void }) => (
  <div className="mb-4 flex gap-2">
    {[12, 24, 48].map(p => (
      <button key={p} onClick={() => setPeriod(p)}
        className={`border px-3 py-1 text-sm ${period === p ? "bg-blue-600 text-white" : ""}`}>
        {p}h
      </button>
    ))}
  </div>
);

const App = () => {
  const [tab, setTab] = useState("Accueil");
  const [r, setR] = useState(generateCurrentReadings());
  const [period, setPeriod] = useState(24);
  const [mode, setMode] = useState("auto");
  const [pan, setPan] = useState(90);
  const [tilt, setTilt] = useState(45);
  const status = getSystemStatus();

  useEffect(() => {
    const id = setInterval(() => setR(generateCurrentReadings()), 5000);
    return () => clearInterval(id);
  }, []);

  const histData = generateHistoricalData(period);
  const chartData = histData.map(d => ({
    time: new Date(d.timestamp).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
    production: Number((d.productionVoltage * d.productionCurrent).toFixed(1)),
    consommation: Number((d.consumptionVoltage * d.consumptionCurrent).toFixed(1)),
    co2: d.co2,
    particules: d.microparticles,
  }));

  const doExport = (format: string) => {
    const data = generateHistoricalData(period);
    if (format === "csv") {
      const csv = "Heure,V Prod,A Prod,V Cons,A Cons,CO2,PM\n" +
        data.map(d => `${d.timestamp},${d.productionVoltage},${d.productionCurrent},${d.consumptionVoltage},${d.consumptionCurrent},${d.co2},${d.microparticles}`).join("\n");
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
      a.download = `donnees_${period}h.csv`;
      a.click();
    } else if (format === "json") {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
      a.download = `donnees_${period}h.json`;
      a.click();
    } else {
      const doc = new jsPDF();
      doc.text("Track My Sun - Rapport", 14, 20);
      doc.setFontSize(10);
      doc.text(`Période : ${period}h`, 14, 28);
      autoTable(doc, {
        head: [["Heure", "V Prod", "A Prod", "V Cons", "A Cons", "CO₂", "PM"]],
        body: data.map(d => [
          new Date(d.timestamp).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
          d.productionVoltage, d.productionCurrent, d.consumptionVoltage, d.consumptionCurrent, d.co2, d.microparticles
        ]),
        startY: 34,
        styles: { fontSize: 7 },
      });
      doc.save(`donnees_${period}h.pdf`);
    }
  };

  return (
    <div className="min-h-screen">
      <header className="border-b p-4">
        <h1 className="text-xl font-bold">Track My Sun - BTS CIEL</h1>
        <nav className="mt-2 flex gap-4">
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={tab === t ? "font-bold text-blue-600" : "text-gray-600 hover:underline"}>
              {t}
            </button>
          ))}
        </nav>
      </header>

      <main className="p-4">
        {tab === "Accueil" && (
          <div>
            <h2 className="text-lg font-bold mb-4">Tableau de bord</h2>
            <p className="mb-4 text-sm text-gray-500">Dernière mesure : {status.lastAcquisition} | Mode : {status.mode} | Batterie : {status.batteryLevel}%</p>
            <table className="w-full border text-sm">
              <thead><tr className="bg-gray-100"><th className="border p-2 text-left">Mesure</th><th className="border p-2 text-left">Valeur</th></tr></thead>
              <tbody>
                <tr><td className="border p-2">Tension production</td><td className="border p-2">{r.productionVoltage} V</td></tr>
                <tr><td className="border p-2">Courant production</td><td className="border p-2">{r.productionCurrent} A</td></tr>
                <tr><td className="border p-2">Puissance production</td><td className="border p-2">{(r.productionVoltage * r.productionCurrent).toFixed(1)} W</td></tr>
                <tr><td className="border p-2">Tension consommation</td><td className="border p-2">{r.consumptionVoltage} V</td></tr>
                <tr><td className="border p-2">Courant consommation</td><td className="border p-2">{r.consumptionCurrent} A</td></tr>
                <tr><td className="border p-2">CO₂</td><td className="border p-2">{r.co2} ppm</td></tr>
                <tr><td className="border p-2">Microparticules</td><td className="border p-2">{r.microparticles} µg/m³</td></tr>
                <tr><td className="border p-2">Orientation panneau</td><td className="border p-2">Pan {status.panAngle}° / Tilt {status.tiltAngle}°</td></tr>
              </tbody>
            </table>
          </div>
        )}

        {tab === "Production" && (
          <div>
            <h2 className="text-lg font-bold mb-2">Production & Consommation</h2>
            <PeriodButtons period={period} setPeriod={setPeriod} />
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="time" fontSize={10} /><YAxis fontSize={10} /><Tooltip />
                <Line type="monotone" dataKey="production" stroke="orange" dot={false} name="Production" />
                <Line type="monotone" dataKey="consommation" stroke="red" dot={false} name="Consommation" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {tab === "Pollution" && (
          <div>
            <h2 className="text-lg font-bold mb-2">Qualité de l'air</h2>
            <PeriodButtons period={period} setPeriod={setPeriod} />
            <h3 className="font-semibold mb-1">CO₂ (ppm)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="time" fontSize={10} /><YAxis fontSize={10} /><Tooltip />
                <Line type="monotone" dataKey="co2" stroke="green" dot={false} />
              </LineChart>
            </ResponsiveContainer>
            <h3 className="font-semibold mt-4 mb-1">Microparticules (µg/m³)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="time" fontSize={10} /><YAxis fontSize={10} /><Tooltip />
                <Line type="monotone" dataKey="particules" stroke="steelblue" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {tab === "Pilotage" && (
          <div>
            <h2 className="text-lg font-bold mb-4">Pilotage du panneau</h2>
            <div className="mb-4">
              <p className="font-semibold mb-1">Mode :</p>
              {["flat", "tilted", "auto"].map(m => (
                <label key={m} className="mr-4">
                  <input type="radio" name="mode" value={m} checked={mode === m} onChange={() => setMode(m)} className="mr-1" />
                  {m === "flat" ? "À plat (0°)" : m === "tilted" ? "53° Sud" : "Automatique"}
                </label>
              ))}
            </div>
            <p>Orientation (Pan) : {pan}° | Inclinaison (Tilt) : {tilt}°</p>
            {mode !== "auto" && (
              <div className="mt-2 flex gap-2">
                <button onClick={() => setTilt(t => Math.min(t + 5, 90))} className="border px-3 py-1">↑</button>
                <button onClick={() => setTilt(t => Math.max(t - 5, 0))} className="border px-3 py-1">↓</button>
                <button onClick={() => setPan(p => Math.max(p - 5, 0))} className="border px-3 py-1">←</button>
                <button onClick={() => setPan(p => Math.min(p + 5, 180))} className="border px-3 py-1">→</button>
                <button onClick={() => { setPan(90); setTilt(0); }} className="border px-3 py-1">Reset</button>
              </div>
            )}
          </div>
        )}

        {tab === "Export" && (
          <div>
            <h2 className="text-lg font-bold mb-4">Export des données</h2>
            <PeriodButtons period={period} setPeriod={setPeriod} />
            <div className="flex gap-4">
              <button onClick={() => doExport("pdf")} className="border px-4 py-2 hover:bg-gray-100">PDF</button>
              <button onClick={() => doExport("csv")} className="border px-4 py-2 hover:bg-gray-100">CSV</button>
              <button onClick={() => doExport("json")} className="border px-4 py-2 hover:bg-gray-100">JSON</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
