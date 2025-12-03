
'use client';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface PerformanceScoreChartProps {
  data: {
    name: string;
    avgPerformanceScore: number;
  }[];
}

export function PerformanceScoreChart({ data }: PerformanceScoreChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          angle={-45}
          textAnchor="end"
          height={80}
          interval={0}
          fontSize={12}
        />
        <YAxis unit="" domain={[0, 100]} />
        <Tooltip formatter={(value: number) => `${value}`} />
        <Legend />
        <Bar
          dataKey="avgPerformanceScore"
          fill="var(--color-chart-3)"
          name="Score de Performance"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

    