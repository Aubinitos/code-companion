import { useState } from "react";
import { generateHistoricalData, getAirQualityLabel } from "@/lib/mockData";
import { PageHeader, PeriodSelector, ChartCard, TOOLTIP_STYLE, AXIS_TICK, GRID_STROKE, COLORS } from "@/components/shared";
import {
  AreaChart, Area, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from "recharts";

const Pollution = () => {
  const [period, setPeriod] = useState<12 | 24 | 48>(24);
  const rawData = generateHistoricalData(period);
  const data = rawData.map(d => ({
    time: new Date(d.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    co2: d.co2,
    microparticles: d.microparticles,
  }));

  const latest = rawData[rawData.length - 1];
  const avgCO2 = Math.round(rawData.reduce((s, d) => s + d.co2, 0) / rawData.length);
  const quality = getAirQualityLabel(latest?.co2 || 0);
  const axisProps = { tick: AXIS_TICK, tickLine: false, axisLine: false } as const;

  const stats = [
    { label: "CO₂ actuel", value: latest?.co2, unit: "ppm", color: "text-chart-co2" },
    { label: "Microparticules", value: latest?.microparticles, unit: "µg/m³", color: "text-chart-particles" },
    { label: "CO₂ moyen", value: avgCO2, unit: "ppm", color: "text-foreground" },
  ];

  return (
    <div className="space-y-8">
      <PageHeader title="Qualité de l'air" subtitle="Mesures de CO₂ et microparticules" />
      <PeriodSelector period={period} onChange={setPeriod} />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(s => (
          <div key={s.label} className="stat-card">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className={`mt-2 text-3xl font-bold font-mono ${s.color}`}>{s.value} <span className="text-sm text-muted-foreground">{s.unit}</span></p>
          </div>
        ))}
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Qualité de l'air</p>
          <p className={`mt-2 text-2xl font-bold ${quality.color}`}>{quality.label}</p>
        </div>
      </div>

      <ChartCard title="CO₂ (ppm)" delay={0.1}>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="gCo2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.co2} stopOpacity={0.3} />
                <stop offset="95%" stopColor={COLORS.co2} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
            <XAxis dataKey="time" {...axisProps} />
            <YAxis {...axisProps} unit=" ppm" />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <ReferenceLine y={500} stroke={COLORS.warning} strokeDasharray="5 5" label={{ value: "Seuil", fill: COLORS.warning, fontSize: 12 }} />
            <Area type="monotone" dataKey="co2" stroke={COLORS.co2} fill="url(#gCo2)" strokeWidth={2} name="CO₂" />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Microparticules (µg/m³)" delay={0.2}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
            <XAxis dataKey="time" {...axisProps} />
            <YAxis {...axisProps} unit=" µg/m³" />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <ReferenceLine y={50} stroke={COLORS.consumption} strokeDasharray="5 5" label={{ value: "Limite OMS", fill: COLORS.consumption, fontSize: 12 }} />
            <Line type="monotone" dataKey="microparticles" stroke={COLORS.particles} strokeWidth={2} dot={false} name="PM2.5/PM10" />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
};

export default Pollution;
