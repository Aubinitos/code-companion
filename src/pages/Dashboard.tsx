import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sun, Zap, Battery, Wind, Thermometer, Activity, Clock, Wifi } from "lucide-react";
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
  const modeLabels = { flat: 'À plat', tilted: '53° Sud', auto: 'Automatique' };

  const infoItems = [
    { icon: Clock, label: "Dernière mesure", value: status.lastAcquisition, color: "text-primary" },
    { icon: Sun, label: "Mode", value: modeLabels[status.mode], color: "text-primary", mono: true },
    { icon: Battery, label: "Batterie", value: `${status.batteryLevel}%`, color: "text-success" },
    { icon: Wifi, label: "WiFi", value: "Connecté", color: "text-success" },
    { icon: Activity, label: "Uptime", value: status.systemUptime, color: "text-muted-foreground" },
  ];

  return (
    <div className="space-y-8">
      <PageHeader title="Tableau de bord" subtitle="Supervision en temps réel du système Track My Sun" />

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-4 rounded-xl border border-border bg-card p-4">
        {infoItems.map(item => (
          <div key={item.label} className="flex items-center gap-2 text-sm">
            <item.icon className={`h-4 w-4 ${item.color}`} />
            <span className="text-muted-foreground">{item.label} :</span>
            <span className={`font-mono ${item.color === "text-primary" ? "text-primary" : item.color === "text-success" ? "text-success" : "text-foreground"}`}>{item.value}</span>
          </div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Production" value={productionPower} unit="W" icon={Zap} trend="up" colorClass="text-primary" delay={0.1} />
        <StatCard title="Consommation" value={consumptionPower} unit="W" icon={Activity} trend="stable" colorClass="text-destructive" delay={0.15} />
        <StatCard title="CO₂" value={readings.co2} unit="ppm" icon={Wind} trend="stable" colorClass="text-chart-co2" delay={0.2} />
        <StatCard title="Microparticules" value={readings.microparticles} unit="µg/m³" icon={Thermometer} trend="down" colorClass="text-chart-particles" delay={0.25} />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { title: "Tension Prod", value: readings.productionVoltage, unit: "V", delay: 0.3 },
          { title: "Courant Prod", value: readings.productionCurrent, unit: "A", delay: 0.35 },
          { title: "Tension Cons", value: readings.consumptionVoltage, unit: "V", delay: 0.4, color: "text-destructive" },
          { title: "Courant Cons", value: readings.consumptionCurrent, unit: "A", delay: 0.45, color: "text-destructive" },
        ].map(s => (
          <StatCard key={s.title} title={s.title} value={s.value} unit={s.unit} icon={s.color ? Activity : Zap} colorClass={s.color || "text-primary"} delay={s.delay} />
        ))}
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
        className="flex items-center justify-between rounded-xl border border-border bg-card p-6">
        <div>
          <p className="text-sm text-muted-foreground">Qualité de l'air</p>
          <p className={`mt-1 text-2xl font-bold ${airQuality.color}`}>{airQuality.label}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Orientation panneau</p>
          <p className="mt-1 font-mono text-lg text-foreground">Pan {status.panAngle}° / Tilt {status.tiltAngle}°</p>
        </div>
      </motion.div>

      <ChartCard title="Production vs Consommation (12h)" delay={0.4}>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="gradProd" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.production} stopOpacity={0.3} />
                <stop offset="95%" stopColor={COLORS.production} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradCons" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.consumption} stopOpacity={0.3} />
                <stop offset="95%" stopColor={COLORS.consumption} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
            <XAxis dataKey="time" tick={AXIS_TICK} tickLine={false} axisLine={false} />
            <YAxis tick={AXIS_TICK} tickLine={false} axisLine={false} unit="W" />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Area type="monotone" dataKey="production" stroke={COLORS.production} fill="url(#gradProd)" strokeWidth={2} name="Production (W)" />
            <Area type="monotone" dataKey="consumption" stroke={COLORS.consumption} fill="url(#gradCons)" strokeWidth={2} name="Consommation (W)" />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
};

export default Dashboard;
