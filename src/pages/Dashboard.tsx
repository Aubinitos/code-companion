import { useState, useEffect } from "react";
import { generateCurrentReadings, getSystemStatus } from "@/lib/mockData";

const Dashboard = () => {
  const [r, setR] = useState(generateCurrentReadings());
  const status = getSystemStatus();

  useEffect(() => {
    const id = setInterval(() => setR(generateCurrentReadings()), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Tableau de bord</h2>
      <p className="mb-4 text-sm text-gray-500">Dernière mesure : {status.lastAcquisition} | Mode : {status.mode} | Batterie : {status.batteryLevel}%</p>

      <table className="w-full border text-sm mb-6">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-left">Mesure</th>
            <th className="border p-2 text-left">Valeur</th>
          </tr>
        </thead>
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
  );
};

export default Dashboard;
