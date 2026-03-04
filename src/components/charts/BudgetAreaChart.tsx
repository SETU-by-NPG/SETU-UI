import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface BudgetAreaChartProps {
  data: Array<{ month: string; income: number; expenditure: number }>
  height?: number
}

export function BudgetAreaChart({ data, height = 300 }: BudgetAreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <defs>
          <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#16a34a" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="expenditureGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#dc2626" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 11, fill: '#9CA3AF' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#9CA3AF' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(value: number) => `£${(value / 1000).toFixed(0)}k`}
        />
        <Tooltip
          contentStyle={{
            borderRadius: '8px',
            border: '1px solid #E5E7EB',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
            fontSize: 12,
          }}
          formatter={(value: number, name: string) => [
            `£${value.toLocaleString('en-GB')}`,
            name,
          ]}
        />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        <Area
          type="monotone"
          dataKey="income"
          stroke="#16a34a"
          strokeWidth={2}
          fill="url(#incomeGradient)"
          fillOpacity={0.2}
          name="Income"
        />
        <Area
          type="monotone"
          dataKey="expenditure"
          stroke="#dc2626"
          strokeWidth={2}
          fill="url(#expenditureGradient)"
          fillOpacity={0.2}
          name="Expenditure"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
