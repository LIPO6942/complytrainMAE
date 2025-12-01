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
    label: 'Taux de réussite',
  },
  Marketing: {
    label: 'Marketing',
    color: 'hsl(var(--chart-1))',
  },
  Ventes: {
    label: 'Ventes',
    color: 'hsl(var(--chart-2))',
  },
  Ingénierie: {
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
  isLoading: boolean;
};

export function SuccessChart({ data, isLoading }: SuccessChartProps) {
  if (isLoading) {
    return <div className="h-72 flex items-center justify-center"><Skeleton className="h-48 w-48 rounded-full" /></div>
  }
  
  if (!data || data.length === 0) {
    return <div className="h-72 flex items-center justify-center text-muted-foreground">Aucun département trouvé.</div>
  }


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
        />
        <ChartLegend
          content={<ChartLegendContent nameKey="name" />}
          className="-mt-4"
        />
      </PieChart>
    </ChartContainer>
  );
}
