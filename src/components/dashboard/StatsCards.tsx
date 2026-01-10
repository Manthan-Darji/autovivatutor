import { Flame, Clock, CheckSquare, Trophy } from "lucide-react";
import { motion } from "framer-motion";

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  value: string | number;
  label: string;
  badge?: string;
  badgeColor?: string;
  iconBgClass: string;
  iconColorClass: string;
  glowClass?: string;
  delay?: number;
}

const stats: Omit<StatCardProps, "delay">[] = [
  {
    icon: Flame,
    value: 3,
    label: "DAY STREAK",
    badge: "+1 today",
    badgeColor: "text-stat-flame",
    iconBgClass: "bg-stat-flame-bg",
    iconColorClass: "text-stat-flame",
    glowClass: "stat-glow-flame",
  },
  {
    icon: Clock,
    value: "0.0",
    label: "HOURS LEARNED",
    badge: "+2.5h this week",
    badgeColor: "text-stat-clock",
    iconBgClass: "bg-stat-clock-bg",
    iconColorClass: "text-stat-clock",
    glowClass: "stat-glow-clock",
  },
  {
    icon: CheckSquare,
    value: 0,
    label: "LESSONS DONE",
    iconBgClass: "bg-stat-check-bg",
    iconColorClass: "text-stat-check",
    glowClass: "stat-glow-check",
  },
  {
    icon: Trophy,
    value: "1,250",
    label: "TOTAL XP",
    badge: "Top 10%",
    badgeColor: "text-stat-trophy",
    iconBgClass: "bg-stat-trophy-bg",
    iconColorClass: "text-stat-trophy",
    glowClass: "stat-glow-trophy",
  },
];

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <StatCard key={stat.label} {...stat} delay={index * 0.1} />
      ))}
    </div>
  );
}

function StatCard({
  icon: Icon,
  value,
  label,
  badge,
  badgeColor,
  iconBgClass,
  iconColorClass,
  glowClass,
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`relative rounded-xl bg-card p-5 shadow-sm border border-border ${glowClass}`}
    >
      {/* Badge */}
      {badge && (
        <span className={`absolute right-4 top-4 text-xs font-medium ${badgeColor}`}>
          {badge}
        </span>
      )}

      {/* Icon */}
      <div className={`mb-3 inline-flex rounded-xl p-2.5 ${iconBgClass}`}>
        <Icon className={`h-5 w-5 ${iconColorClass}`} />
      </div>

      {/* Value */}
      <div className="text-3xl font-bold text-foreground">{value}</div>

      {/* Label */}
      <div className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
    </motion.div>
  );
}
