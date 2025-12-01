'use client';

import { Pie, PieChart } from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';

const chartConfig = {
  value: {
    label: 'Taux',
  },
  Complété: {
    label: 'Complété',
    color: 'hsl(var(--chart-1))',
  },
  'À faire': {
    label: 'À faire',
    color: 'hsl(var(--muted))',
  },
} satisfies ChartConfig;

type CompletionChartProps = {
  data: { name: string; value: number; fill: string }[];
  isLoading: boolean;
};

export function CompletionChart({ data, isLoading }: CompletionChartProps) {
  if (isLoading) {
    return <div className="h-72 flex items-center justify-center"><Skeleton className="h-48 w-48 rounded-full" /></div>
  }
  
  if (!data || data.length === 0) {
    return <div className="h-72 flex items-center justify-center text-muted-foreground">Aucune donnée à afficher.</div>
  }

  const totalValue = data.reduce((acc, item) => acc + item.value, 0);

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square h-72"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel formatter={(value, name) => `${value}%`} />}
        />
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={60}
          strokeWidth={5}
          labelLine={false}
          label={({
            cx,
            cy,
            midAngle,
            innerRadius,
            outerRadius,
            value,
            index,
          }) => {
            if (index === 1) return null; // Hide label for "À faire"
            const RADIAN = Math.PI / 180
            const radius = 12 + innerRadius + (outerRadius - innerRadius)
            const x = cx + radius * Math.cos(-midAngle * RADIAN)
            const y = cy + radius * Math.sin(-midAngle * RADIAN)

            return (
              <text
                x={x}
                y={y}
                className="fill-foreground text-base font-bold"
                textAnchor={x > cx ? "start" : "end"}
                dominantBaseline="central"
              >
                {value}%
              </text>
            )
          }}
        >
        </Pie>
        <ChartLegend
          content={<ChartLegendContent nameKey="name" />}
          className="-mt-4"
        />
      </PieChart>
    </ChartContainer>
  );
}
