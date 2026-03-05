import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  unit: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "stable";
  colorClass?: string;
  delay?: number;
}

const StatCard = ({ title, value, unit, icon: Icon, trend, colorClass = "text-primary", delay = 0 }: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="stat-card group"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <div className="mt-2 flex items-baseline gap-1">
            <span className={`text-3xl font-bold font-mono ${colorClass}`}>{value}</span>
            <span className="text-sm text-muted-foreground">{unit}</span>
          </div>
        </div>
        <div className={`rounded-lg p-2.5 bg-secondary ${colorClass}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1 text-xs">
          <span className={trend === "up" ? "text-success" : trend === "down" ? "text-destructive" : "text-muted-foreground"}>
            {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"}
          </span>
          <span className="text-muted-foreground">
            {trend === "up" ? "En hausse" : trend === "down" ? "En baisse" : "Stable"}
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default StatCard;
