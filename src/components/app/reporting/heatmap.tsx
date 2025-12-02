'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

type HeatmapProps = {
  data: { user: string; [key: string]: string | number }[];
  headers: string[];
  isLoading: boolean;
};

const getColorForScore = (score: number | string) => {
  if (typeof score !== 'number') return 'bg-muted/30 text-muted-foreground';
  if (score >= 95) return 'bg-green-200/50 dark:bg-green-800/50 text-green-900 dark:text-green-200';
  if (score >= 85) return 'bg-emerald-100/50 dark:bg-emerald-900/50 text-emerald-900 dark:text-emerald-200';
  if (score >= 75) return 'bg-yellow-100/50 dark:bg-yellow-900/50 text-yellow-900 dark:text-yellow-200';
  if (score >= 65) return 'bg-orange-100/50 dark:bg-orange-900/50 text-orange-900 dark:text-orange-200';
  return 'bg-red-200/50 dark:bg-red-900/50 text-red-900 dark:text-red-200';
};

export function Heatmap({ data, headers, isLoading }: HeatmapProps) {
  if (isLoading) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead><Skeleton className="h-5 w-20" /></TableHead>
                    {Array.from({length: 5}).map((_, i) => <TableHead key={i}><Skeleton className="h-5 w-24" /></TableHead>)}
                </TableRow>
            </TableHeader>
            <TableBody>
                {Array.from({length: 3}).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        {Array.from({length: 5}).map((_, j) => <TableCell key={j}><Skeleton className="h-8 w-full" /></TableCell>)}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
  }
  
  if (!data || data.length === 0 || !headers || headers.length === 0) {
    return <p className="text-center text-muted-foreground p-4">Aucune donnée utilisateur ou catégorie à afficher.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-bold">Utilisateur</TableHead>
            {headers.map((header) => (
              <TableHead key={header} className="text-center font-bold">{header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.user}>
              <TableCell className="font-medium">{row.user}</TableCell>
              {headers.map((header) => {
                const score = row[header];
                return (
                 <TableCell key={header} className="text-center">
                    <div
                        className={cn(
                        'rounded-md px-2 py-1 text-sm font-semibold',
                        getColorForScore(score)
                        )}
                    >
                        {typeof score === 'number' ? `${score}%` : score}
                    </div>
                 </TableCell>
                )
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
