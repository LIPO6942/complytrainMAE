'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useUser } from '@/firebase';
import { allBadges } from '@/lib/data';
import { Clock, Target, CheckCircle, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function UserStats() {
    const { userProfile, isUserLoading } = useUser();
    const badgesEarned = userProfile?.badges?.length || 0;
    const totalBadges = allBadges.length;
    const completionRate = totalBadges > 0 ? Math.round((badgesEarned / totalBadges) * 100) : 0;
    
    // Simulating data for now
    const averageScore = 92;
    const timeSpent = "12h 45m";

    const stats = [
        {
            title: "Taux de complétion",
            value: `${completionRate}%`,
            icon: <Target className="w-6 h-6 text-primary" />,
            description: "Progression globale"
        },
        {
            title: "Quiz Réussis",
            value: badgesEarned,
            icon: <CheckCircle className="w-6 h-6 text-green-500" />,
            description: "Badges obtenus"
        },
        {
            title: "Score Moyen",
            value: `${averageScore}%`,
            icon: <TrendingUp className="w-6 h-6 text-blue-500" />,
            description: "Performance aux quiz (simulé)"
        },
        {
            title: "Temps Passé",
            value: timeSpent,
            icon: <Clock className="w-6 h-6 text-orange-500" />,
            description: "Formation totale (simulé)"
        }
    ];

    if (isUserLoading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {Array.from({length: 4}).map((_, i) => (
                     <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                           <Skeleton className="h-5 w-2/3" />
                           <Skeleton className="h-6 w-6 rounded-sm" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-1/3 mb-1" />
                            <Skeleton className="h-4 w-1/2" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
                 <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                        {stat.icon}
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <p className="text-xs text-muted-foreground">{stat.description}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    )

}