import { motion } from "framer-motion";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

const data = [
  { skill: "Coding", value: 75 },
  { skill: "History", value: 50 },
  { skill: "Science", value: 60 },
  { skill: "Math", value: 80 },
  { skill: "Arts", value: 40 },
  { skill: "Lang", value: 55 },
];

export function SkillMasteryChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
      className="rounded-xl bg-card p-6 shadow-sm border border-border"
    >
      {/* Header */}
      <h3 className="mb-4 text-lg font-semibold text-foreground">Skill Mastery</h3>

      {/* Chart */}
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid
              stroke="hsl(var(--border))"
              strokeDasharray="3 3"
            />
            <PolarAngleAxis
              dataKey="skill"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            />
            <Radar
              name="Skills"
              dataKey="value"
              stroke="hsl(var(--chart-radar))"
              fill="hsl(var(--chart-radar))"
              fillOpacity={0.25}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
