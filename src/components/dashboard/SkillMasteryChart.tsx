import { useState } from "react";
import { motion } from "framer-motion";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const data = [
  { skill: "Coding", value: 75, fullMark: 100 },
  { skill: "History", value: 50, fullMark: 100 },
  { skill: "Science", value: 60, fullMark: 100 },
  { skill: "Math", value: 80, fullMark: 100 },
  { skill: "Arts", value: 40, fullMark: 100 },
  { skill: "Lang", value: 55, fullMark: 100 },
];

export function SkillMasteryChart() {
  const [activeSkill, setActiveSkill] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
      className="rounded-xl bg-card p-6 shadow-sm border border-border"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Skill Mastery</h3>
        {activeSkill && (
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full"
          >
            {activeSkill}: {data.find(d => d.skill === activeSkill)?.value}%
          </motion.span>
        )}
      </div>

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
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11, cursor: "pointer" }}
              onMouseEnter={(e) => setActiveSkill(e.value)}
              onMouseLeave={() => setActiveSkill(null)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
              formatter={(value: number) => [`${value}%`, "Mastery"]}
            />
            <Radar
              name="Skills"
              dataKey="value"
              stroke="hsl(var(--chart-radar))"
              fill="hsl(var(--chart-radar))"
              fillOpacity={0.25}
              strokeWidth={2}
              animationDuration={1000}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        {data.map((item) => (
          <div
            key={item.skill}
            className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
            onMouseEnter={() => setActiveSkill(item.skill)}
            onMouseLeave={() => setActiveSkill(null)}
          >
            <div 
              className="w-2 h-2 rounded-full"
              style={{ 
                backgroundColor: activeSkill === item.skill 
                  ? "hsl(var(--primary))" 
                  : "hsl(var(--chart-radar))",
                opacity: activeSkill === item.skill ? 1 : 0.5
              }}
            />
            <span>{item.skill}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
