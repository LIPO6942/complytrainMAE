
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
import { CompletionChart } from '@/components/app/reporting/completion-chart';
import { SuccessChart } from '@/components/app/reporting/success-chart';
import { Heatmap } from '@/components/app/reporting/heatmap';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection } from 'firebase/firestore';
import { useMemo }from 'react';
import type { Course } from '@/lib/quiz-data';
import { Skeleton } from '@/components/ui/skeleton';
import { staticCourses } from '@/lib/quiz-data';

type UserProfile = {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    badges?: string[];
    departmentId?: string;
    scores?: Record<string, number>;
    role?: string;
    quizzesPassed?: number;
    averageScore?: number;
}

type Department = {
    id: string;
    name: string;
}


export default function ReportingPage() {
  const firestore = useFirestore();
  const { userProfile, isUserLoading: isAuthLoading } = useUser();
  
  const isAdmin = useMemo(() => !isAuthLoading && userProfile?.role === 'admin', [isAuthLoading, userProfile]);

  // --- Firestore Data Hooks ---
  const usersQuery = useMemoFirebase(() => {
    // IMPORTANT: Only fetch all users if the current user is a confirmed admin
    if (!firestore || !isAdmin) return null;
    return collection(firestore, 'users');
  }, [firestore, isAdmin]);
  
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
  const { data: dynamicCourses, isLoading: isLoadingCourses } = useCollection<Course>(coursesQuery);
  
  // Combine static and dynamic courses
  const allCourses = useMemo(() => {
    if (isLoadingCourses) return []; // Return empty array while loading
    const courses = [...staticCourses];
    if (dynamicCourses) {
      const staticIds = new Set(staticCourses.map(c => c.id));
      const filteredDynamic = dynamicCourses.filter(c => !staticIds.has(c.id));
      courses.push(...filteredDynamic);
    }
    return courses;
  }, [dynamicCourses, isLoadingCourses]);

  // Determine the list of users to generate reports for.
  // Admins see all non-admin users. Regular users only see themselves.
  const reportingUsers = useMemo(() => {
    if (isAuthLoading) return [];
    if (isAdmin) {
        return allUsers?.filter(u => u.role !== 'admin') || [];
    }
    return userProfile ? [userProfile as UserProfile] : [];
  }, [isAdmin, allUsers, userProfile, isAuthLoading]);

  // --- Memoized Data Calculations ---

  const completionData = useMemo(() => {
    if (reportingUsers.length === 0 || allCourses.length === 0) return [];

    const totalPossibleQuizzes = allCourses.filter(c => c.quizId || c.quiz).length;
    if (totalPossibleQuizzes === 0) return [];
    
    // For admin, calculate average completion
    if (isAdmin) {
        const totalPassedQuizzes = reportingUsers.reduce((acc, user) => acc + (user.quizzesPassed || 0), 0);
        const totalPossibleForAllUsers = reportingUsers.length * totalPossibleQuizzes;
        if (totalPossibleForAllUsers === 0) return [];
        const completionPercentage = Math.round((totalPassedQuizzes / totalPossibleForAllUsers) * 100);
        return [
            { name: 'Complété', value: completionPercentage, fill: 'var(--color-chart-1)' },
            { name: 'À faire', value: 100 - completionPercentage, fill: 'hsl(var(--muted))' }
        ];
    }

    // For single user
    const user = reportingUsers[0];
    const userPassedQuizzes = user.quizzesPassed || 0;
    const completionPercentage = Math.round((userPassedQuizzes / totalPossibleQuizzes) * 100);

    return [
      { name: 'Complété', value: completionPercentage, fill: 'var(--color-chart-1)' },
      { name: 'À faire', value: 100 - completionPercentage, fill: 'hsl(var(--muted))' }
    ];
  }, [reportingUsers, isAdmin, allCourses]);
  
  const successData = useMemo(() => {
    if (reportingUsers.length === 0 || !departments) return [];

    // For single user view
    if (!isAdmin && userProfile) {
        const avgScore = Math.round(userProfile.averageScore || 0);
        if (avgScore > 0) {
            return [{
                name: "Mon score moyen",
                value: avgScore,
                fill: `var(--color-chart-1)`,
            }];
        }
        return [];
    }

    // For admin view
    const deptScores: Record<string, { totalScore: number; count: number }> = {};
    
    reportingUsers.forEach(user => {
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

  }, [reportingUsers, departments, isAdmin, userProfile]);

  const heatmapDerivedData = useMemo(() => {
    if (reportingUsers.length === 0 || allCourses.length === 0) {
        return { heatmapTopics: [], heatmapData: [] };
    }

    // 1. Create a live map of quizId -> category from all available courses
    const quizIdToCategory: Record<string, string> = {};
    allCourses.forEach(course => {
        const quizId = course.quizId || course.quiz?.id;
        if (quizId && course.category) {
            quizIdToCategory[quizId] = course.category;
        }
    });

    // 2. Identify all unique categories that are actually in use by users with scores
    const usedCategories = new Set<string>();
    reportingUsers.forEach(user => {
        if (user.scores) {
            Object.keys(user.scores).forEach(quizId => {
                const category = quizIdToCategory[quizId];
                if (category) {
                    usedCategories.add(category);
                }
            });
        }
    });
    const heatmapTopics = Array.from(usedCategories).sort();

    // 3. Generate heatmap data based on the live mapping
    const heatmapData = reportingUsers.map(user => {
        const scoresByCategory: Record<string, { total: number; count: number }> = {};
        heatmapTopics.forEach(topic => scoresByCategory[topic] = { total: 0, count: 0 });

        if (user.scores) {
            Object.entries(user.scores).forEach(([quizId, score]) => {
                const category = quizIdToCategory[quizId];
                // Only include scores for categories that are currently in our dynamic list
                if (category && heatmapTopics.includes(category)) {
                    scoresByCategory[category].total += score;
                    scoresByCategory[category].count++;
                }
            });
        }

        const userHeatmapRow: { user: string; [key: string]: string | number } = {
            user: user.firstName || user.email,
        };

        heatmapTopics.forEach(topic => {
            const categoryData = scoresByCategory[topic];
            if (categoryData.count > 0) {
                userHeatmapRow[topic] = Math.round(categoryData.total / categoryData.count);
            } else {
                userHeatmapRow[topic] = "N/A";
            }
        });
        return userHeatmapRow;
    });

    return { heatmapTopics, heatmapData };

}, [reportingUsers, allCourses]);
  
  // The overall loading state depends on whether the user is admin or not
  const isLoading = useMemo(() => {
    if (isAuthLoading) return true;
    if (isAdmin) {
        return isLoadingUsers || isLoadingDepartments || isLoadingCourses;
    }
    // For non-admins, we don't depend on isLoadingUsers
    return isAuthLoading || isLoadingDepartments || isLoadingCourses;
  }, [isAuthLoading, isAdmin, isLoadingUsers, isLoadingDepartments, isLoadingCourses]);

  if (isLoading) {
    return (
        <div className="space-y-6">
            <Skeleton className="h-10 w-1/3" />
             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
                <Skeleton className="h-80 lg:col-span-3" />
                <Skeleton className="h-80 lg:col-span-2" />
            </div>
            <Skeleton className="h-96" />
        </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Rapports et analyses</h1>
          <p className="text-muted-foreground">
            {isAdmin 
              ? "Analyse en temps réel de la formation à la conformité de votre organisation." 
              : "Analyse en temps réel de votre progression de formation."
            }
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
            <CardDescription>Pourcentage de tous les quiz de conformité terminés avec succès.</CardDescription>
          </CardHeader>
          <CardContent>
            <CompletionChart data={completionData} isLoading={isLoading} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{isAdmin ? "Taux de réussite moyen par département" : "Mon score moyen"}</CardTitle>
            <CardDescription>{isAdmin ? "Taux de réussite moyen aux quiz pour chaque unité commerciale." : "Votre performance moyenne sur tous les quiz."}</CardDescription>
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
          <Heatmap data={heatmapDerivedData.heatmapData} headers={heatmapDerivedData.heatmapTopics} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
}
