import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from "recharts";

const data = [
  { day: "Mon", hours: 2, lessons: 3 },
  { day: "Tue", hours: 3, lessons: 5 },
  { day: "Wed", hours: 2.5, lessons: 4 },
  { day: "Thu", hours: 2, lessons: 3 },
  { day: "Fri", hours: 1, lessons: 2 },
  { day: "Sat", hours: 5, lessons: 8 },
  { day: "Sun", hours: 1.5, lessons: 2 },
];

export function LearningActivityChart() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const maxHours = Math.max(...data.map((d) => d.hours));
  const totalHours = data.reduce((sum, d) => sum + d.hours, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="rounded-xl bg-card p-6 shadow-sm border border-border"
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-foreground">Learning Activity</h3>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            Last 7 Days
          </span>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-foreground">{totalHours}h</p>
          <p className="text-xs text-muted-foreground">Total this week</p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={data} 
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            onMouseLeave={() => setActiveIndex(null)}
          >
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
              tickFormatter={(value) => `${value}h`}
            />
            <Tooltip
              cursor={{ fill: "hsl(var(--muted)/0.1)" }}
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
              labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
              formatter={(value: number, name: string) => [
                `${value} ${name === "hours" ? "hours" : "lessons"}`,
                name === "hours" ? "Study Time" : "Lessons"
              ]}
            />
            <Bar 
              dataKey="hours" 
              radius={[6, 6, 6, 6]} 
              maxBarSize={40}
              animationDuration={800}
              onMouseEnter={(_, index) => setActiveIndex(index)}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    activeIndex === index
                      ? "hsl(var(--primary))"
                      : entry.hours === maxHours
                        ? "hsl(var(--chart-bar))"
                        : "hsl(var(--chart-bar-muted))"
                  }
                  style={{ 
                    transition: "fill 0.2s ease",
                    cursor: "pointer"
                  }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Quick Stats */}
      <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t border-border">
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground">
            {data.reduce((sum, d) => sum + d.lessons, 0)}
          </p>
          <p className="text-xs text-muted-foreground">Lessons</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground">
            {(totalHours / 7).toFixed(1)}h
          </p>
          <p className="text-xs text-muted-foreground">Daily Avg</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-primary">
            {data.find(d => d.hours === maxHours)?.day}
          </p>
          <p className="text-xs text-muted-foreground">Best Day</p>
        </div>
      </div>
    </motion.div>
  );
}
