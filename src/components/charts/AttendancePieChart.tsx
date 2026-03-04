import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const DEFAULT_DATA = [
  { name: 'Present', value: 91, color: '#16a34a' },
  { name: 'Absent', value: 5, color: '#dc2626' },
  { name: 'Late', value: 3, color: '#ca8a04' },
  { name: 'Excused', value: 1, color: '#2563eb' },
]

interface AttendancePieChartProps {
  data?: Array<{ name: string; value: number; color: string }>
  height?: number
}

export function AttendancePieChart({ data = DEFAULT_DATA, height = 300 }: AttendancePieChartProps) {
  const total = data.reduce((sum, entry) => sum + entry.value, 0)

  const renderCenterLabel = ({
    viewBox,
  }: {
    viewBox?: { cx?: number; cy?: number }
  }) => {
    const cx = viewBox?.cx ?? 0
    const cy = viewBox?.cy ?? 0
    return (
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
        <tspan x={cx} dy="-0.4em" fontSize={22} fontWeight={700} fill="#111827">
          {total}%
        </tspan>
        <tspan x={cx} dy="1.4em" fontSize={11} fill="#6B7280">
          Total
        </tspan>
      </text>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={2}
          dataKey="value"
          label={renderCenterLabel}
          labelLine={false}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            borderRadius: '8px',
            border: '1px solid #E5E7EB',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
            fontSize: 12,
          }}
          formatter={(value: number, name: string) => [`${value}%`, name]}
        />
        <Legend wrapperStyle={{ fontSize: 11 }} />
      </PieChart>
    </ResponsiveContainer>
  )
}
