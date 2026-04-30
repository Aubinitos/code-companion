import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Adresse du serveur où se trouve api.php
const API = "http://172.16.10.15/api.php";

const tabs = ["Accueil", "Production", "Pollution", "Pilotage", "Export"];

const App = () => {
  const [tab, setTab] = useState("Accueil");
  const [r, setR] = useState<any>(null);
  const [historique, setHistorique] = useState<any[]>([]);
  const [mode, setMode] = useState("auto");
  const [erreur, setErreur] = useState("");

  // État de connexion
  const [connecte, setConnecte] = useState(() => sessionStorage.getItem("connecte") === "1");
  const [loginInput, setLoginInput] = useState("");
  const [mdpInput, setMdpInput] = useState("");
  const [erreurLogin, setErreurLogin] = useState("");
  const [modeInscription, setModeInscription] = useState(false);
  const [messageOk, setMessageOk] = useState("");

  const seConnecter = (e: React.FormEvent) => {
    e.preventDefault();
    setErreurLogin("");
    setMessageOk("");
    fetch(`${API}?action=login&login=${encodeURIComponent(loginInput)}&mdp=${encodeURIComponent(mdpInput)}`)
      .then(res => res.json())
      .then(data => {
        if (data?.ok) {
          sessionStorage.setItem("connecte", "1");
          sessionStorage.setItem("user", data.user?.Login || loginInput);
          setConnecte(true);
        } else {
          setErreurLogin("Identifiant ou mot de passe incorrect");
        }
      })
      .catch(() => setErreurLogin("Impossible de joindre le serveur"));
  };

  const creerCompte = (e: React.FormEvent) => {
    e.preventDefault();
    setErreurLogin("");
    setMessageOk("");
    if (loginInput.length < 3 || mdpInput.length < 4) {
      setErreurLogin("Identifiant (3+) et mot de passe (4+) requis");
      return;
    }
    fetch(`${API}?action=inscription&login=${encodeURIComponent(loginInput)}&mdp=${encodeURIComponent(mdpInput)}`)
      .then(res => res.json())
      .then(data => {
        if (data?.ok) {
          setMessageOk("Compte créé. Vous pouvez vous connecter.");
          setModeInscription(false);
          setMdpInput("");
        } else {
          setErreurLogin(data?.erreur || "Impossible de créer le compte");
        }
      })
      .catch(() => setErreurLogin("Impossible de joindre le serveur"));
  };

  const seDeconnecter = () => {
    sessionStorage.removeItem("connecte");
    sessionStorage.removeItem("user");
    setConnecte(false);
    setLoginInput("");
    setMdpInput("");
  };

  // Charger le dernier relevé
  const chargerReleve = () => {
    fetch(API + "?action=releves")
      .then(res => res.json())
      .then(data => { setR(data); setErreur(""); })
      .catch(() => setErreur("Impossible de joindre le serveur"));
  };

  // Charger l'historique
  const chargerHistorique = () => {
    fetch(API + "?action=historique")
      .then(res => res.json())
      .then(data => { setHistorique(data); setErreur(""); })
      .catch(() => setErreur("Impossible de joindre le serveur"));
  };

  // Charger la config
  const chargerConfig = () => {
    fetch(API + "?action=config")
      .then(res => res.json())
      .then(data => { if (data?.mode) setMode(data.mode); })
      .catch(() => {});
  };

  // Changer le mode
  const changerMode = (m: string) => {
    fetch(API + "?action=set_mode&mode=" + m)
      .then(() => { setMode(m); })
      .catch(() => setErreur("Erreur lors du changement de mode"));
  };

  useEffect(() => {
    if (!connecte) return;
    chargerReleve();
    chargerHistorique();
    chargerConfig();
    const id = setInterval(chargerReleve, 5000);
    return () => clearInterval(id);
  }, [connecte]);

  // Préparer les données pour les graphiques
  const chartData = historique.map(d => ({
    time: d.heure_releve,
    production: Number((d.up * d.ip).toFixed(1)),
    consommation: Number((d.uc * d.ic).toFixed(1)),
    co2: Number(d.co2),
    pm: Number(d.mp),
  }));

  const doExport = (fmt: string) => {
    if (fmt === "csv") {
      const csv = "Heure,V Prod,A Prod,V Cons,A Cons,CO2,PM\n" +
        historique.map(d => `${d.heure_releve},${d.up},${d.ip},${d.uc},${d.ic},${d.co2},${d.mp}`).join("\n");
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
      a.download = "donnees.csv"; a.click();
    } else if (fmt === "json") {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([JSON.stringify(historique, null, 2)], { type: "application/json" }));
      a.download = "donnees.json"; a.click();
    } else {
      const doc = new jsPDF();
      doc.text("Track My Sun - Rapport", 14, 20);
      autoTable(doc, {
        head: [["Heure", "V Prod", "A Prod", "V Cons", "A Cons", "CO₂", "PM"]],
        body: historique.map(d => [d.heure_releve, d.up, d.ip, d.uc, d.ic, d.co2, d.mp]),
        startY: 30, styles: { fontSize: 7 },
      });
      doc.save("donnees.pdf");
    }
  };

  // Page de connexion
  if (!connecte) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <form onSubmit={seConnecter} className="bg-white border rounded p-6 w-full max-w-sm shadow">
          <h1 className="text-xl font-bold mb-4 text-center">Track My Sun</h1>
          <p className="text-sm text-gray-600 mb-4 text-center">Connexion requise</p>
          <label className="block text-sm mb-1">Identifiant</label>
          <input type="text" value={loginInput} onChange={e => setLoginInput(e.target.value)}
            className="border w-full p-2 mb-3 rounded" required autoFocus />
          <label className="block text-sm mb-1">Mot de passe</label>
          <input type="password" value={mdpInput} onChange={e => setMdpInput(e.target.value)}
            className="border w-full p-2 mb-3 rounded" required />
          {erreurLogin && <p className="text-red-600 text-sm mb-3">{erreurLogin}</p>}
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
            Se connecter
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="border-b p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Track My Sun - BTS CIEL</h1>
          <button onClick={seDeconnecter} className="text-sm border px-3 py-1 rounded hover:bg-gray-100">
            Déconnexion
          </button>
        </div>
        <nav className="mt-2 flex gap-4">
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={tab === t ? "font-bold text-blue-600" : "text-gray-600 hover:underline"}>{t}</button>
          ))}
        </nav>
      </header>

      {erreur && <div className="bg-red-100 text-red-700 p-2 text-sm">{erreur}</div>}

      <main className="p-4">
        {tab === "Accueil" && (
          <div>
            <h2 className="text-lg font-bold mb-4">Tableau de bord</h2>
            {r ? (
              <table className="w-full border text-sm">
                <thead><tr className="bg-gray-100"><th className="border p-2 text-left">Mesure</th><th className="border p-2 text-left">Valeur</th></tr></thead>
                <tbody>
                  <tr><td className="border p-2">Tension production</td><td className="border p-2">{r.up} V</td></tr>
                  <tr><td className="border p-2">Courant production</td><td className="border p-2">{r.ip} A</td></tr>
                  <tr><td className="border p-2">Puissance production</td><td className="border p-2">{(r.up * r.ip).toFixed(1)} W</td></tr>
                  <tr><td className="border p-2">Tension consommation</td><td className="border p-2">{r.uc} V</td></tr>
                  <tr><td className="border p-2">Courant consommation</td><td className="border p-2">{r.ic} A</td></tr>
                  <tr><td className="border p-2">CO₂</td><td className="border p-2">{r.co2} ppm</td></tr>
                  <tr><td className="border p-2">Microparticules</td><td className="border p-2">{r.mp} µg/m³</td></tr>
                </tbody>
              </table>
            ) : <p>Chargement...</p>}
          </div>
        )}

        {tab === "Production" && (
          <div>
            <h2 className="text-lg font-bold mb-2">Production & Consommation</h2>
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
            <p className="font-semibold mb-1">Mode actuel : {mode}</p>
            <div className="flex gap-2 mt-2">
              {["flat", "tilted", "auto"].map(m => (
                <button key={m} onClick={() => changerMode(m)}
                  className={`border px-3 py-1 ${mode === m ? "bg-blue-600 text-white" : ""}`}>
                  {m === "flat" ? "À plat" : m === "tilted" ? "53° Sud" : "Auto"}
                </button>
              ))}
            </div>
          </div>
        )}

        {tab === "Export" && (
          <div>
            <h2 className="text-lg font-bold mb-4">Export des données</h2>
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
