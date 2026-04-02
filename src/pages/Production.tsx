import { useState } from "react";
import { generateHistoricalData } from "@/lib/mockData";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const Production = () => {
  const [period, setPeriod] = useState(24);
  const data = generateHistoricalData(period).map(d => ({
    time: new Date(d.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    production: Number((d.productionVoltage * d.productionCurrent).toFixed(1)),
    consommation: Number((d.consumptionVoltage * d.consumptionCurrent).toFixed(1)),
  }));

  return (
    <div>
      <h2 className="text-lg font-bold mb-2">Production & Consommation</h2>
      <div className="mb-4 flex gap-2">
        {[12, 24, 48].map(p => (
          <button key={p} onClick={() => setPeriod(p)}
            className={`border px-3 py-1 text-sm ${period === p ? 'bg-blue-600 text-white' : ''}`}>
            {p}h
          </button>
        ))}
      </div>

      <h3 className="font-semibold mb-1">Puissance (W)</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" fontSize={10} />
          <YAxis fontSize={10} />
          <Tooltip />
          <Line type="monotone" dataKey="production" stroke="orange" dot={false} name="Production" />
          <Line type="monotone" dataKey="consommation" stroke="red" dot={false} name="Consommation" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Production;
