import { useState } from "react";
import { generateHistoricalData } from "@/lib/mockData";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const Pollution = () => {
  const [period, setPeriod] = useState(24);
  const data = generateHistoricalData(period).map(d => ({
    time: new Date(d.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    co2: d.co2,
    particules: d.microparticles,
  }));

  return (
    <div>
      <h2 className="text-lg font-bold mb-2">Qualité de l'air</h2>
      <div className="mb-4 flex gap-2">
        {[12, 24, 48].map(p => (
          <button key={p} onClick={() => setPeriod(p)}
            className={`border px-3 py-1 text-sm ${period === p ? 'bg-blue-600 text-white' : ''}`}>
            {p}h
          </button>
        ))}
      </div>

      <h3 className="font-semibold mb-1">CO₂ (ppm)</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" fontSize={10} />
          <YAxis fontSize={10} />
          <Tooltip />
          <Line type="monotone" dataKey="co2" stroke="green" dot={false} />
        </LineChart>
      </ResponsiveContainer>

      <h3 className="font-semibold mt-4 mb-1">Microparticules (µg/m³)</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" fontSize={10} />
          <YAxis fontSize={10} />
          <Tooltip />
          <Line type="monotone" dataKey="particules" stroke="steelblue" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Pollution;
