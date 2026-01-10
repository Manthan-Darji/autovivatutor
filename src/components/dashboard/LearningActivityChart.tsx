import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";

const data = [
  { day: "Mon", hours: 2 },
  { day: "Tue", hours: 3 },
  { day: "Wed", hours: 2.5 },
  { day: "Thu", hours: 2 },
  { day: "Fri", hours: 1 },
  { day: "Sat", hours: 5 },
  { day: "Sun", hours: 1.5 },
];

export function LearningActivityChart() {
  const maxHours = Math.max(...data.map((d) => d.hours));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="rounded-xl bg-card p-6 shadow-sm border border-border"
    >
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <h3 className="text-lg font-semibold text-foreground">Learning Activity</h3>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          Last 7 Days
        </span>
      </div>

      {/* Chart */}
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              domain={[0, 8]}
              ticks={[0, 2, 4, 6, 8]}
            />
            <Bar dataKey="hours" radius={[6, 6, 6, 6]} maxBarSize={40}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.hours === maxHours
                      ? "hsl(var(--chart-bar))"
                      : "hsl(var(--chart-bar-muted))"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
