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
    consPower: Number((d.consumptionVoltage * d.consumptionCurrent).toFixed(1)),
    balance: Number((d.productionVoltage * d.productionCurrent - d.consumptionVoltage * d.consumptionCurrent).toFixed(1)),
  }));

  return (
    <div className="space-y-6">
      <PageHeader title="Production & Consommation" subtitle="Analyse détaillée de la production et consommation électrique" />
      <PeriodSelector period={period} onChange={setPeriod} />

      <ChartCard title="Puissance (W)">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
            <XAxis dataKey="time" tick={AXIS_TICK} />
            <YAxis tick={AXIS_TICK} unit="W" />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Legend />
            <Area type="monotone" dataKey="power" stroke={COLORS.production} fill={COLORS.production} fillOpacity={0.2} strokeWidth={2} name="Production" />
            <Area type="monotone" dataKey="consPower" stroke={COLORS.consumption} fill={COLORS.consumption} fillOpacity={0.2} strokeWidth={2} name="Consommation" />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <ChartCard title="Tension (V)">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
              <XAxis dataKey="time" tick={AXIS_TICK} />
              <YAxis tick={AXIS_TICK} domain={[10, 15]} unit="V" />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Line type="monotone" dataKey="voltage" stroke={COLORS.production} strokeWidth={2} dot={false} name="Tension" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Courant (A)">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
              <XAxis dataKey="time" tick={AXIS_TICK} />
              <YAxis tick={AXIS_TICK} unit="A" />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Line type="monotone" dataKey="current" stroke={COLORS.production} strokeWidth={2} dot={false} name="Courant" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="Bilan Énergétique (W)">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
            <XAxis dataKey="time" tick={AXIS_TICK} />
            <YAxis tick={AXIS_TICK} unit="W" />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Bar dataKey="balance" name="Bilan" fill={COLORS.co2} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
};

export default Production;
