'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const chartConfig = {
  desktop: {
    label: 'Completions',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

type CompletionChartProps = {
  data: { month: string; desktop: number; }[];
};

export function CompletionChart({ data }: CompletionChartProps) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full h-72">
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dashed" />}
        />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
