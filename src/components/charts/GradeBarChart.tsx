import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from 'recharts'

const GRADE_COLORS: Record<string, string> = {
  'A*': '#7c3aed',
  A: '#2563eb',
  B: '#16a34a',
  C: '#ca8a04',
  D: '#ea580c',
  E: '#dc2626',
  U: '#6b7280',
}

interface GradeBarChartProps {
  data: Array<{ grade: string; count: number }>
  height?: number
}

export function GradeBarChart({ data, height = 300 }: GradeBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
        <XAxis
          dataKey="grade"
          tick={{ fontSize: 11, fill: '#9CA3AF' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#9CA3AF' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            borderRadius: '8px',
            border: '1px solid #E5E7EB',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
            fontSize: 12,
          }}
          cursor={{ fill: '#F9FAFB' }}
        />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        <Bar dataKey="count" name="Students" radius={[4, 4, 0, 0]}>
          {data.map((entry) => (
            <Cell
              key={entry.grade}
              fill={GRADE_COLORS[entry.grade] ?? '#2563eb'}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
