'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { allBadges } from '@/lib/data';
import { Clock, Target, CheckCircle, TrendingUp, HelpCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { collection } from 'firebase/firestore';
import { useMemo } from 'react';
import { staticCourses, type Course } from '@/lib/quiz-data';

function formatTime(seconds: number): string {
    if (isNaN(seconds) || seconds < 0) {
        return "0m";
    }
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);

    if (h > 0) {
        return `${h}h ${m}m`;
    }
    return `${m}m`;
}


export function UserStats() {
    const { userProfile, isUserLoading } = useUser();
    const firestore = useFirestore();

    const coursesQuery = useMemoFirebase(() => {
      if (!firestore) return null;
      return collection(firestore, 'courses');
    }, [firestore]);
    const { data: dynamicCourses, isLoading: isLoadingCourses } = useCollection<Course>(coursesQuery);

    const totalQuizzes = useMemo(() => {
        const dynamicCourseIds = new Set(dynamicCourses?.map(c => c.id) || []);
        const uniqueStaticCourses = staticCourses.filter(c => !dynamicCourseIds.has(c.id) && c.quiz);
        const dynamicCoursesWithQuiz = dynamicCourses?.filter(c => c.quizId) || [];
        return uniqueStaticCourses.length + dynamicCoursesWithQuiz.length;
    }, [dynamicCourses]);
    
    const quizzesPassed = userProfile?.quizzesPassed || 0;
    const quizAttempts = userProfile?.quizAttempts || 0;
    const quizzesFailed = quizAttempts - quizzesPassed;
    
    const completionRate = totalQuizzes > 0 ? Math.round((quizzesPassed / totalQuizzes) * 100) : 0;
    
    const averageScore = userProfile?.averageScore ? Math.round(userProfile.averageScore) : 0;
    const timeSpent = userProfile?.totalTimeSpent ? formatTime(userProfile.totalTimeSpent) : "0m";

    const stats = [
        {
            title: "Taux de complétion",
            value: `${completionRate}%`,
            icon: <Target className="w-6 h-6 text-primary" />,
            description: "Quiz réussis / Quiz total"
        },
        {
            title: "Quiz Tentés",
            value: `${quizzesPassed} / ${quizAttempts}`,
            icon: <CheckCircle className="w-6 h-6 text-green-500" />,
            description: "Réussis / Total Tentatives"
        },
        {
            title: "Score Moyen",
            value: `${averageScore}%`,
            icon: <TrendingUp className="w-6 h-6 text-blue-500" />,
            description: "Performance aux quiz"
        },
        {
            title: "Temps Passé",
            value: timeSpent,
            icon: <Clock className="w-6 h-6 text-orange-500" />,
            description: "Formation totale"
        }
    ];

    if (isUserLoading || isLoadingCourses) {
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
