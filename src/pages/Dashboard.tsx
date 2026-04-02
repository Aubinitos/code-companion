import { useState, useEffect } from "react";
import { Sun, Zap, Activity, Wind, Thermometer, Battery, Clock, Wifi } from "lucide-react";
import StatCard from "@/components/StatCard";
import { PageHeader, ChartCard, TOOLTIP_STYLE, AXIS_TICK, GRID_STROKE, COLORS } from "@/components/shared";
import { generateCurrentReadings, getSystemStatus, getAirQualityLabel, generateHistoricalData } from "@/lib/mockData";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const Dashboard = () => {
  const [readings, setReadings] = useState(generateCurrentReadings());
  const [status, setStatus] = useState(getSystemStatus());
  const [chartData] = useState(() =>
    generateHistoricalData(12).map(d => ({
      time: new Date(d.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      production: Number((d.productionVoltage * d.productionCurrent).toFixed(1)),
      consumption: Number((d.consumptionVoltage * d.consumptionCurrent).toFixed(1)),
    }))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setReadings(generateCurrentReadings());
      setStatus(getSystemStatus());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const productionPower = (readings.productionVoltage * readings.productionCurrent).toFixed(1);
  const consumptionPower = (readings.consumptionVoltage * readings.consumptionCurrent).toFixed(1);
  const airQuality = getAirQualityLabel(readings.co2);

  return (
    <div className="space-y-6">
      <PageHeader title="Tableau de bord" subtitle="Supervision en temps réel du système Track My Sun" />

      <div className="rounded-lg border border-border bg-card p-3 text-sm flex flex-wrap gap-4">
        <span><Clock className="inline h-4 w-4 mr-1" />Dernière mesure : {status.lastAcquisition}</span>
        <span><Sun className="inline h-4 w-4 mr-1" />Mode : {status.mode}</span>
        <span><Battery className="inline h-4 w-4 mr-1" />Batterie : {status.batteryLevel}%</span>
        <span><Wifi className="inline h-4 w-4 mr-1" />WiFi : Connecté</span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Production" value={productionPower} unit="W" icon={Zap} trend="up" colorClass="text-accent" />
        <StatCard title="Consommation" value={consumptionPower} unit="W" icon={Activity} trend="stable" colorClass="text-destructive" />
        <StatCard title="CO₂" value={readings.co2} unit="ppm" icon={Wind} trend="stable" colorClass="text-success" />
        <StatCard title="Microparticules" value={readings.microparticles} unit="µg/m³" icon={Thermometer} trend="down" colorClass="text-info" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Tension Prod" value={readings.productionVoltage} unit="V" icon={Zap} colorClass="text-accent" />
        <StatCard title="Courant Prod" value={readings.productionCurrent} unit="A" icon={Zap} colorClass="text-accent" />
        <StatCard title="Tension Cons" value={readings.consumptionVoltage} unit="V" icon={Activity} colorClass="text-destructive" />
        <StatCard title="Courant Cons" value={readings.consumptionCurrent} unit="A" icon={Activity} colorClass="text-destructive" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Qualité de l'air</p>
          <p className={`mt-1 text-xl font-bold ${airQuality.color}`}>{airQuality.label}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Orientation panneau</p>
          <p className="mt-1 text-lg text-foreground">Pan {status.panAngle}° / Tilt {status.tiltAngle}°</p>
        </div>
      </div>

      <ChartCard title="Production vs Consommation (12h)">
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
            <XAxis dataKey="time" tick={AXIS_TICK} />
            <YAxis tick={AXIS_TICK} unit="W" />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Area type="monotone" dataKey="production" stroke={COLORS.production} fill={COLORS.production} fillOpacity={0.2} strokeWidth={2} name="Production (W)" />
            <Area type="monotone" dataKey="consumption" stroke={COLORS.consumption} fill={COLORS.consumption} fillOpacity={0.2} strokeWidth={2} name="Consommation (W)" />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
};

export default Dashboard;
