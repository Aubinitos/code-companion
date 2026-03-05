import { useState } from "react";
import { motion } from "framer-motion";
import { generateHistoricalData, getAirQualityLabel } from "@/lib/mockData";
import {
  AreaChart, Area, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine
} from "recharts";

const Pollution = () => {
  const [period, setPeriod] = useState<12 | 24 | 48>(24);
  const rawData = generateHistoricalData(period);
  const data = rawData.map(d => ({
    time: new Date(d.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    co2: d.co2,
    microparticles: d.microparticles,
  }));

  const latestCO2 = rawData[rawData.length - 1]?.co2 || 0;
  const latestMP = rawData[rawData.length - 1]?.microparticles || 0;
  const avgCO2 = Math.round(rawData.reduce((s, d) => s + d.co2, 0) / rawData.length);
  const avgMP = Math.round(rawData.reduce((s, d) => s + d.microparticles, 0) / rawData.length);
  const quality = getAirQualityLabel(latestCO2);

  const tooltipStyle = {
    backgroundColor: 'hsl(220, 18%, 10%)',
    border: '1px solid hsl(220, 14%, 18%)',
    borderRadius: '8px',
    color: 'hsl(40, 20%, 92%)',
  };

  const periods = [
    { value: 12 as const, label: '12h' },
    { value: 24 as const, label: '24h' },
    { value: 48 as const, label: '48h' },
  ];

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-foreground">Qualité de l'air</h1>
        <p className="mt-1 text-muted-foreground">Mesures de CO₂ et microparticules</p>
      </motion.div>

      <div className="flex gap-2">
        {periods.map(p => (
          <button key={p.value} onClick={() => setPeriod(p.value)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${period === p.value ? 'gradient-solar text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}>
            {p.label}
          </button>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">CO₂ actuel</p>
          <p className="mt-2 text-3xl font-bold font-mono text-chart-co2">{latestCO2} <span className="text-sm text-muted-foreground">ppm</span></p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Microparticules</p>
          <p className="mt-2 text-3xl font-bold font-mono text-chart-particles">{latestMP} <span className="text-sm text-muted-foreground">µg/m³</span></p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">CO₂ moyen</p>
          <p className="mt-2 text-3xl font-bold font-mono text-foreground">{avgCO2} <span className="text-sm text-muted-foreground">ppm</span></p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Qualité de l'air</p>
          <p className={`mt-2 text-2xl font-bold ${quality.color}`}>{quality.label}</p>
        </div>
      </div>

      {/* CO2 Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold text-foreground">CO₂ (ppm)</h2>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="gCo2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 18%)" />
            <XAxis dataKey="time" tick={{ fill: 'hsl(220, 10%, 55%)', fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: 'hsl(220, 10%, 55%)', fontSize: 11 }} tickLine={false} axisLine={false} unit=" ppm" />
            <Tooltip contentStyle={tooltipStyle} />
            <ReferenceLine y={500} stroke="hsl(48, 96%, 53%)" strokeDasharray="5 5" label={{ value: "Seuil", fill: "hsl(48, 96%, 53%)", fontSize: 12 }} />
            <Area type="monotone" dataKey="co2" stroke="hsl(142, 71%, 45%)" fill="url(#gCo2)" strokeWidth={2} name="CO₂" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Microparticles Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold text-foreground">Microparticules (µg/m³)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 18%)" />
            <XAxis dataKey="time" tick={{ fill: 'hsl(220, 10%, 55%)', fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: 'hsl(220, 10%, 55%)', fontSize: 11 }} tickLine={false} axisLine={false} unit=" µg/m³" />
            <Tooltip contentStyle={tooltipStyle} />
            <ReferenceLine y={50} stroke="hsl(0, 72%, 51%)" strokeDasharray="5 5" label={{ value: "Limite OMS", fill: "hsl(0, 72%, 51%)", fontSize: 12 }} />
            <Line type="monotone" dataKey="microparticles" stroke="hsl(199, 89%, 48%)" strokeWidth={2} dot={false} name="PM2.5/PM10" />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};

export default Pollution;
