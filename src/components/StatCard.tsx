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

const StatCard = ({ title, value, unit, icon: Icon, trend, colorClass = "text-primary" }: StatCardProps) => (
  <div className="rounded-lg border border-border bg-card p-4">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <div className="mt-1 flex items-baseline gap-1">
          <span className={`text-2xl font-bold ${colorClass}`}>{value}</span>
          <span className="text-sm text-muted-foreground">{unit}</span>
        </div>
      </div>
      <Icon className={`h-5 w-5 ${colorClass}`} />
    </div>
    {trend && (
      <p className="mt-2 text-xs text-muted-foreground">
        {trend === "up" ? "↑ En hausse" : trend === "down" ? "↓ En baisse" : "→ Stable"}
      </p>
    )}
  </div>
);

export default StatCard;
