import { useState } from "react";
import { generateHistoricalData } from "@/lib/mockData";
import { PageHeader, PeriodSelector, ChartCard, TOOLTIP_STYLE, AXIS_TICK, GRID_STROKE, COLORS } from "@/components/shared";
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

  const axisProps = { tick: AXIS_TICK, tickLine: false, axisLine: false } as const;

  return (
    <div className="space-y-8">
      <PageHeader title="Production & Consommation" subtitle="Analyse détaillée de la production et consommation électrique" />
      <PeriodSelector period={period} onChange={setPeriod} />

      <ChartCard title="Puissance (W)" delay={0.1}>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="gProd" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.production} stopOpacity={0.3} />
                <stop offset="95%" stopColor={COLORS.production} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gCons" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.consumption} stopOpacity={0.3} />
                <stop offset="95%" stopColor={COLORS.consumption} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
            <XAxis dataKey="time" {...axisProps} />
            <YAxis {...axisProps} unit="W" />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Legend />
            <Area type="monotone" dataKey="power" stroke={COLORS.production} fill="url(#gProd)" strokeWidth={2} name="Production" />
            <Area type="monotone" dataKey="consPower" stroke={COLORS.consumption} fill="url(#gCons)" strokeWidth={2} name="Consommation" />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {[
          { title: "Tension (V)", keys: [{ k: "voltage", n: "Prod." }, { k: "consVoltage", n: "Cons." }], domain: [10, 15], unit: "V", delay: 0.2 },
          { title: "Courant (A)", keys: [{ k: "current", n: "Prod." }, { k: "consCurrent", n: "Cons." }], unit: "A", delay: 0.25 },
        ].map(chart => (
          <ChartCard key={chart.title} title={chart.title} delay={chart.delay}>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
                <XAxis dataKey="time" {...axisProps} />
                <YAxis {...axisProps} domain={chart.domain as any} unit={chart.unit} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Legend />
                {chart.keys.map((line, i) => (
                  <Line key={line.k} type="monotone" dataKey={line.k} stroke={i === 0 ? COLORS.production : COLORS.consumption} strokeWidth={2} dot={false} name={line.n} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        ))}
      </div>

      <ChartCard title="Bilan Énergétique (W)" delay={0.3}>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
            <XAxis dataKey="time" {...axisProps} />
            <YAxis {...axisProps} unit="W" />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Bar dataKey="balance" name="Bilan" fill={COLORS.co2} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
};

export default Production;
