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

const chartConfig = {
  value: {
    label: 'Taux de réussite',
  },
  Marketing: {
    label: 'Marketing',
    color: 'hsl(var(--chart-1))',
  },
  Sales: {
    label: 'Ventes',
    color: 'hsl(var(--chart-2))',
  },
  Engineering: {
    label: 'Ingénierie',
    color: 'hsl(var(--chart-3))',
  },
  Support: {
    label: 'Support',
    color: 'hsl(var(--chart-4))',
  },
  Finance: {
    label: 'Finance',
    color: 'hsl(var(--chart-5))',
  },
} satisfies ChartConfig;

type SuccessChartProps = {
  data: { name: string; value: number; fill: string }[];
};

export function SuccessChart({ data }: SuccessChartProps) {
  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square h-72"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel formatter={(value, name) => `${value}%`}/>}
        />
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={60}
          strokeWidth={5}
        />
        <ChartLegend
          content={<ChartLegendContent nameKey="name" />}
          className="-mt-4"
        />
      </PieChart>
    </ChartContainer>
  );
}
