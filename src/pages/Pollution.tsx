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

  return (
    <div className="space-y-6">
      <PageHeader title="Qualité de l'air" subtitle="Mesures de CO₂ et microparticules" />
      <PeriodSelector period={period} onChange={setPeriod} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">CO₂ actuel</p>
          <p className="mt-1 text-2xl font-bold text-success">{latest?.co2} <span className="text-sm text-muted-foreground">ppm</span></p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Microparticules</p>
          <p className="mt-1 text-2xl font-bold text-info">{latest?.microparticles} <span className="text-sm text-muted-foreground">µg/m³</span></p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">CO₂ moyen</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{avgCO2} <span className="text-sm text-muted-foreground">ppm</span></p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Qualité de l'air</p>
          <p className={`mt-1 text-xl font-bold ${quality.color}`}>{quality.label}</p>
        </div>
      </div>

      <ChartCard title="CO₂ (ppm)">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
            <XAxis dataKey="time" tick={AXIS_TICK} />
            <YAxis tick={AXIS_TICK} unit=" ppm" />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <ReferenceLine y={500} stroke={COLORS.warning} strokeDasharray="5 5" label="Seuil" />
            <Area type="monotone" dataKey="co2" stroke={COLORS.co2} fill={COLORS.co2} fillOpacity={0.2} strokeWidth={2} name="CO₂" />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Microparticules (µg/m³)">
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
            <XAxis dataKey="time" tick={AXIS_TICK} />
            <YAxis tick={AXIS_TICK} unit=" µg/m³" />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <ReferenceLine y={50} stroke={COLORS.consumption} strokeDasharray="5 5" label="Limite OMS" />
            <Line type="monotone" dataKey="microparticles" stroke={COLORS.particles} strokeWidth={2} dot={false} name="PM2.5/PM10" />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
};

export default Pollution;
