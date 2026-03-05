import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sun, Zap, Battery, Wind, Thermometer, Activity, Clock, Wifi } from "lucide-react";
import StatCard from "@/components/StatCard";
import { generateCurrentReadings, getSystemStatus, getAirQualityLabel, generateHistoricalData } from "@/lib/mockData";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const Dashboard = () => {
  const [readings, setReadings] = useState(generateCurrentReadings());
  const [status, setStatus] = useState(getSystemStatus());
  const [chartData] = useState(() => {
    const data = generateHistoricalData(12);
    return data.map(d => ({
      time: new Date(d.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      production: Number((d.productionVoltage * d.productionCurrent).toFixed(1)),
      consumption: Number((d.consumptionVoltage * d.consumptionCurrent).toFixed(1)),
    }));
  });

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

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-foreground">Tableau de bord</h1>
        <p className="mt-1 text-muted-foreground">Supervision en temps réel du système Track My Sun</p>
      </motion.div>

      {/* System Info Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-4 rounded-xl border border-border bg-card p-4"
      >
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-primary" />
          <span className="text-muted-foreground">Dernière mesure :</span>
          <span className="font-mono text-foreground">{status.lastAcquisition}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Sun className="h-4 w-4 text-primary" />
          <span className="text-muted-foreground">Mode :</span>
          <span className="font-mono text-primary">{modeLabels[status.mode]}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Battery className="h-4 w-4 text-success" />
          <span className="text-muted-foreground">Batterie :</span>
          <span className="font-mono text-foreground">{status.batteryLevel}%</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Wifi className="h-4 w-4 text-info" />
          <span className="text-muted-foreground">WiFi :</span>
          <span className="text-success">Connecté</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Activity className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Uptime :</span>
          <span className="font-mono text-foreground">{status.systemUptime}</span>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Production" value={productionPower} unit="W" icon={Zap} trend="up" colorClass="text-primary" delay={0.1} />
        <StatCard title="Consommation" value={consumptionPower} unit="W" icon={Activity} trend="stable" colorClass="text-destructive" delay={0.15} />
        <StatCard title="CO₂" value={readings.co2} unit="ppm" icon={Wind} trend="stable" colorClass="text-chart-co2" delay={0.2} />
        <StatCard title="Microparticules" value={readings.microparticles} unit="µg/m³" icon={Thermometer} trend="down" colorClass="text-chart-particles" delay={0.25} />
      </div>

      {/* Voltage/Current details */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Tension Production" value={readings.productionVoltage} unit="V" icon={Zap} colorClass="text-primary" delay={0.3} />
        <StatCard title="Courant Production" value={readings.productionCurrent} unit="A" icon={Zap} colorClass="text-primary" delay={0.35} />
        <StatCard title="Tension Consommation" value={readings.consumptionVoltage} unit="V" icon={Activity} colorClass="text-destructive" delay={0.4} />
        <StatCard title="Courant Consommation" value={readings.consumptionCurrent} unit="A" icon={Activity} colorClass="text-destructive" delay={0.45} />
      </div>

      {/* Air Quality Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center justify-between rounded-xl border border-border bg-card p-6"
      >
        <div>
          <p className="text-sm text-muted-foreground">Qualité de l'air</p>
          <p className={`mt-1 text-2xl font-bold ${airQuality.color}`}>{airQuality.label}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Orientation panneau</p>
          <p className="mt-1 font-mono text-lg text-foreground">Pan {status.panAngle}° / Tilt {status.tiltAngle}°</p>
        </div>
      </motion.div>

      {/* Mini Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-xl border border-border bg-card p-6"
      >
        <h2 className="mb-4 text-lg font-semibold text-foreground">Production vs Consommation (12h)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="gradProd" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(36, 95%, 55%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(36, 95%, 55%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradCons" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 18%)" />
            <XAxis dataKey="time" tick={{ fill: 'hsl(220, 10%, 55%)', fontSize: 12 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: 'hsl(220, 10%, 55%)', fontSize: 12 }} tickLine={false} axisLine={false} unit="W" />
            <Tooltip
              contentStyle={{ backgroundColor: 'hsl(220, 18%, 10%)', border: '1px solid hsl(220, 14%, 18%)', borderRadius: '8px', color: 'hsl(40, 20%, 92%)' }}
            />
            <Area type="monotone" dataKey="production" stroke="hsl(36, 95%, 55%)" fill="url(#gradProd)" strokeWidth={2} name="Production (W)" />
            <Area type="monotone" dataKey="consumption" stroke="hsl(0, 72%, 51%)" fill="url(#gradCons)" strokeWidth={2} name="Consommation (W)" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};

export default Dashboard;
