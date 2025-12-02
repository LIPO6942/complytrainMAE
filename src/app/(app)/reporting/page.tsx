'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import { allBadges } from '@/lib/data';
import { CompletionChart } from '@/components/app/reporting/completion-chart';
import { SuccessChart } from '@/components/app/reporting/success-chart';
import { Heatmap } from '@/components/app/reporting/heatmap';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection } from 'firebase/firestore';
import { useMemo }from 'react';
import type { Course } from '@/lib/quiz-data';

type UserProfile = {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    badges?: string[];
    departmentId?: string;
    scores?: Record<string, number>;
    role?: string;
}

type Department = {
    id: string;
    name: string;
}


export default function ReportingPage() {
  const firestore = useFirestore();
  const { userProfile } = useUser();
  const isAdmin = userProfile?.role === 'admin';

  // --- Firestore Data Hooks ---
  const usersQuery = useMemoFirebase(() => {
    if (!firestore) return null; // Wait for firestore
    return collection(firestore, 'users');
  }, [firestore]);
  
  const { data: allUsers, isLoading: isLoadingUsers } = useCollection<UserProfile>(usersQuery);

  const departmentsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'departments');
  }, [firestore]);
  const { data: departments, isLoading: isLoadingDepartments } = useCollection<Department>(departmentsQuery);
  
  const coursesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'courses');
  }, [firestore]);
  const { data: courses, isLoading: isLoadingCourses } = useCollection<Course>(coursesQuery);

  // Filter out admin users
  const users = useMemo(() => allUsers?.filter(u => u.role !== 'admin') || [], [allUsers]);

  // --- Memoized Data Calculations ---

  const completionData = useMemo(() => {
    if (!users || !allBadges) return [];

    const totalPossibleBadges = users.length * allBadges.length;
    const totalEarnedBadges = users.reduce((acc, user) => acc + (user.badges?.length || 0), 0);

    if (totalPossibleBadges === 0) return [];
    
    const completionPercentage = Math.round((totalEarnedBadges / totalPossibleBadges) * 100);

    return [
      { name: 'Complété', value: completionPercentage, fill: 'var(--color-chart-1)' },
      { name: 'À faire', value: 100 - completionPercentage, fill: 'hsl(var(--muted))' }
    ];
  }, [users]);
  
  const successData = useMemo(() => {
    if (!users || !departments) return [];

    const deptScores: Record<string, { totalScore: number; count: number }> = {};
    
    users.forEach(user => {
        if (user.departmentId && user.scores) {
            if (!deptScores[user.departmentId]) {
                deptScores[user.departmentId] = { totalScore: 0, count: 0 };
            }
            Object.values(user.scores).forEach(score => {
                deptScores[user.departmentId].totalScore += score;
                deptScores[user.departmentId].count++;
            });
        }
    });

    const chartColors = ['chart-1', 'chart-2', 'chart-3', 'chart-4', 'chart-5'];
    
    return departments
        .filter(dept => deptScores[dept.id] && deptScores[dept.id].count > 0)
        .map((dept, index) => {
            const avgScore = Math.round(deptScores[dept.id].totalScore / deptScores[dept.id].count);
            return {
                name: dept.name,
                value: avgScore,
                fill: `var(--color-${chartColors[index % chartColors.length]})`,
            };
        });

  }, [users, departments]);


  const heatmapData = useMemo(() => {
    const topics = ['LAB/FT', 'KYC', 'Fraude', 'RGPD', 'Sanctions Internationales'];
    if (!users || !courses) return [];

    const quizIdToCategory: Record<string, string> = {};
    courses.forEach(course => {
        if(course.quizId && course.category) {
            quizIdToCategory[course.quizId] = course.category;
        }
    });

    const getUserScoresByCategory = (user: UserProfile) => {
        const scoresByCategory: Record<string, { total: number; count: number }> = {};
        topics.forEach(topic => scoresByCategory[topic] = { total: 0, count: 0 });

        if (user.scores) {
            Object.entries(user.scores).forEach(([quizId, score]) => {
                const category = quizIdToCategory[quizId];
                if (category && topics.includes(category)) {
                    scoresByCategory[category].total += score;
                    scoresByCategory[category].count++;
                }
            });
        }

        const userHeatmapRow: { user: string; [key: string]: string | number } = {
            user: user.firstName || user.email,
        };

        topics.forEach(topic => {
            const categoryData = scoresByCategory[topic];
            if (categoryData.count > 0) {
                userHeatmapRow[topic] = Math.round(categoryData.total / categoryData.count);
            } else {
                userHeatmapRow[topic] = "N/A";
            }
        });
        return userHeatmapRow;
    };
    
    const targetUsers = isAdmin ? users : (userProfile ? [userProfile as UserProfile] : []);
    
    return targetUsers.map(getUserScoresByCategory);

  }, [users, courses, isAdmin, userProfile]);
  
  const isLoading = isLoadingUsers || isLoadingDepartments || isLoadingCourses;


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Rapports et analyses</h1>
          <p className="text-muted-foreground">
            Analyse en temps réel de la formation à la conformité de votre organisation.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileDown className="mr-2 h-4 w-4" />
            Exporter en PDF
          </Button>
          <Button>
            <FileDown className="mr-2 h-4 w-4" />
            Exporter en Excel
          </Button>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Taux d'achèvement global</CardTitle>
            <CardDescription>Pourcentage de tous les badges de conformité obtenus par les utilisateurs.</CardDescription>
          </CardHeader>
          <CardContent>
            <CompletionChart data={completionData} isLoading={isLoading} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Taux de réussite moyen par département</CardTitle>
            <CardDescription>Taux de réussite moyen aux quiz pour chaque unité commerciale.</CardDescription>
          </CardHeader>
          <CardContent>
            <SuccessChart data={successData} isLoading={isLoading} />
          </CardContent>
        </Card>
      </div>
       <Card>
        <CardHeader>
          <CardTitle>Carte thermique des risques de conformité</CardTitle>
          <CardDescription>Scores par utilisateur et par sujet réglementaire. Les scores les plus bas indiquent un risque plus élevé.</CardDescription>
        </CardHeader>
        <CardContent>
          <Heatmap data={heatmapData} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
}
