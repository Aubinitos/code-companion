import { useState } from "react";
import { motion } from "framer-motion";
import { generateHistoricalData } from "@/lib/mockData";
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

const Production = () => {
  const [period, setPeriod] = useState<12 | 24 | 48>(24);
  const data = generateHistoricalData(period).map(d => ({
    time: new Date(d.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    voltage: d.productionVoltage,
    current: d.productionCurrent,
    power: Number((d.productionVoltage * d.productionCurrent).toFixed(1)),
    consVoltage: d.consumptionVoltage,
    consCurrent: d.consumptionCurrent,
    consPower: Number((d.consumptionVoltage * d.consumptionCurrent).toFixed(1)),
    balance: Number((d.productionVoltage * d.productionCurrent - d.consumptionVoltage * d.consumptionCurrent).toFixed(1)),
  }));

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
        <h1 className="text-3xl font-bold text-foreground">Production & Consommation</h1>
        <p className="mt-1 text-muted-foreground">Analyse détaillée de la production et consommation électrique</p>
      </motion.div>

      {/* Period selector */}
      <div className="flex gap-2">
        {periods.map(p => (
          <button
            key={p.value}
            onClick={() => setPeriod(p.value)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              period === p.value
                ? 'gradient-solar text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Power Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold text-foreground">Puissance (W)</h2>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="gProd" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(36, 95%, 55%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(36, 95%, 55%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gCons" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 18%)" />
            <XAxis dataKey="time" tick={{ fill: 'hsl(220, 10%, 55%)', fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: 'hsl(220, 10%, 55%)', fontSize: 11 }} tickLine={false} axisLine={false} unit="W" />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend />
            <Area type="monotone" dataKey="power" stroke="hsl(36, 95%, 55%)" fill="url(#gProd)" strokeWidth={2} name="Production" />
            <Area type="monotone" dataKey="consPower" stroke="hsl(0, 72%, 51%)" fill="url(#gCons)" strokeWidth={2} name="Consommation" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Voltage & Current */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Tension (V)</h2>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 18%)" />
              <XAxis dataKey="time" tick={{ fill: 'hsl(220, 10%, 55%)', fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: 'hsl(220, 10%, 55%)', fontSize: 11 }} tickLine={false} axisLine={false} domain={[10, 15]} unit="V" />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              <Line type="monotone" dataKey="voltage" stroke="hsl(36, 95%, 55%)" strokeWidth={2} dot={false} name="Prod." />
              <Line type="monotone" dataKey="consVoltage" stroke="hsl(0, 72%, 51%)" strokeWidth={2} dot={false} name="Cons." />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Courant (A)</h2>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 18%)" />
              <XAxis dataKey="time" tick={{ fill: 'hsl(220, 10%, 55%)', fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: 'hsl(220, 10%, 55%)', fontSize: 11 }} tickLine={false} axisLine={false} unit="A" />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              <Line type="monotone" dataKey="current" stroke="hsl(36, 95%, 55%)" strokeWidth={2} dot={false} name="Prod." />
              <Line type="monotone" dataKey="consCurrent" stroke="hsl(0, 72%, 51%)" strokeWidth={2} dot={false} name="Cons." />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Balance */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold text-foreground">Bilan Énergétique (W)</h2>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 18%)" />
            <XAxis dataKey="time" tick={{ fill: 'hsl(220, 10%, 55%)', fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: 'hsl(220, 10%, 55%)', fontSize: 11 }} tickLine={false} axisLine={false} unit="W" />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="balance" name="Bilan" fill="hsl(142, 71%, 45%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};

export default Production;
