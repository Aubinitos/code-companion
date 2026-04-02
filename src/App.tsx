import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// --- Données simulées ---
function rand(min: number, max: number, dec = 2) {
  return Number((Math.random() * (max - min) + min).toFixed(dec));
}

function genReadings() {
  return {
    productionVoltage: rand(11.5, 14.2),
    productionCurrent: rand(0.8, 3.5),
    consumptionVoltage: rand(11.8, 12.6),
    consumptionCurrent: rand(0.3, 1.2),
    co2: rand(350, 600, 0),
    microparticles: rand(5, 80, 0),
  };
}

function genHistory(hours: number) {
  const data: any[] = [];
  const now = Date.now();
  for (let i = hours * 60; i >= 0; i -= 15) {
    const t = new Date(now - i * 60000);
    const h = t.getHours();
    const solar = h >= 6 && h <= 20 ? Math.sin(((h - 6) / 14) * Math.PI) : 0;
    data.push({
      time: t.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
      pV: Number((11 + solar * 3.2 + Math.random() * 0.3).toFixed(2)),
      pA: Number((solar * 3.2 + Math.random() * 0.2).toFixed(2)),
      cV: Number((11.8 + Math.random() * 0.8).toFixed(2)),
      cA: Number((0.3 + Math.random() * 0.9).toFixed(2)),
      co2: Math.round(380 + Math.random() * 180),
      pm: Math.round(10 + Math.random() * 50),
    });
  }
  return data;
}

// --- Application ---
const tabs = ["Accueil", "Production", "Pollution", "Pilotage", "Export"];

const App = () => {
  const [tab, setTab] = useState("Accueil");
  const [r, setR] = useState(genReadings());
  const [period, setPeriod] = useState(24);
  const [mode, setMode] = useState("auto");
  const [pan, setPan] = useState(90);
  const [tilt, setTilt] = useState(45);

  useEffect(() => {
    const id = setInterval(() => setR(genReadings()), 5000);
    return () => clearInterval(id);
  }, []);

  const hist = genHistory(period);
  const chartData = hist.map(d => ({
    ...d,
    production: Number((d.pV * d.pA).toFixed(1)),
    consommation: Number((d.cV * d.cA).toFixed(1)),
  }));

  const PB = () => (
    <div className="mb-4 flex gap-2">
      {[12, 24, 48].map(p => (
        <button key={p} onClick={() => setPeriod(p)}
          className={`border px-3 py-1 text-sm ${period === p ? "bg-blue-600 text-white" : ""}`}>{p}h</button>
      ))}
    </div>
  );

  const doExport = (fmt: string) => {
    const d = genHistory(period);
    if (fmt === "csv") {
      const csv = "Heure,V Prod,A Prod,V Cons,A Cons,CO2,PM\n" +
        d.map(r => `${r.time},${r.pV},${r.pA},${r.cV},${r.cA},${r.co2},${r.pm}`).join("\n");
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
      a.download = `donnees_${period}h.csv`; a.click();
    } else if (fmt === "json") {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([JSON.stringify(d, null, 2)], { type: "application/json" }));
      a.download = `donnees_${period}h.json`; a.click();
    } else {
      const doc = new jsPDF();
      doc.text("Track My Sun - Rapport", 14, 20);
      doc.setFontSize(10);
      doc.text(`Période : ${period}h`, 14, 28);
      autoTable(doc, {
        head: [["Heure", "V Prod", "A Prod", "V Cons", "A Cons", "CO₂", "PM"]],
        body: d.map(r => [r.time, r.pV, r.pA, r.cV, r.cA, r.co2, r.pm]),
        startY: 34, styles: { fontSize: 7 },
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
              className={tab === t ? "font-bold text-blue-600" : "text-gray-600 hover:underline"}>{t}</button>
          ))}
        </nav>
      </header>

      <main className="p-4">
        {tab === "Accueil" && (
          <div>
            <h2 className="text-lg font-bold mb-4">Tableau de bord</h2>
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
              </tbody>
            </table>
          </div>
        )}

        {tab === "Production" && (
          <div>
            <h2 className="text-lg font-bold mb-2">Production & Consommation</h2>
            <PB />
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="time" fontSize={10} /><YAxis fontSize={10} /><Tooltip />
                <Line type="monotone" dataKey="production" stroke="orange" dot={false} />
                <Line type="monotone" dataKey="consommation" stroke="red" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {tab === "Pollution" && (
          <div>
            <h2 className="text-lg font-bold mb-2">Qualité de l'air</h2>
            <PB />
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
                <Line type="monotone" dataKey="pm" stroke="steelblue" dot={false} />
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
            <p>Pan : {pan}° | Tilt : {tilt}°</p>
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
            <PB />
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
