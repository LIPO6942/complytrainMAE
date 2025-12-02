
'use client';
import { useMemo } from 'react';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
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
import { Skeleton } from '@/components/ui/skeleton';
import { allDepartments, allBadges } from '@/lib/data';
import { Users, BookCheck, Clock, Award } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

type UserProfile = {
  id: string;
  departmentId?: string;
  quizzesPassed?: number;
  totalTimeSpent?: number;
  badges?: string[];
  role?: string;
}

// Helper to format time from seconds to a readable string like '120h 30m'
const formatTimeInHours = (seconds: number): string => {
    if (isNaN(seconds) || seconds < 0) return "0h";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes > 0 ? `${minutes}m` : ''}`.trim();
    }
    return `${minutes}m`;
  };

export default function AdminDashboardPage() {
  const { userProfile, isUserLoading: isAuthLoading } = useUser();
  const firestore = useFirestore();

  const isAdmin = useMemo(() => {
    return !isAuthLoading && userProfile?.role === 'admin';
  }, [isAuthLoading, userProfile]);

  const usersQuery = useMemoFirebase(() => {
    // Only create the query if the user is a confirmed admin.
    if (!firestore || !isAdmin) {
      return null;
    }
    return collection(firestore, 'users');
  }, [firestore, isAdmin]);

  const { data: users, isLoading: isLoadingUsers } = useCollection<UserProfile>(usersQuery);

  const nonAdminUsers = useMemo(() => {
    return users?.filter(user => user.role !== 'admin') || [];
  }, [users]);


  const departmentStats = useMemo(() => {
    if (!nonAdminUsers) return [];

    const totalCourses = allBadges.length;

    const statsByDept = allDepartments.map(dept => ({
      id: dept.id,
      name: dept.name,
      userCount: 0,
      totalCompletion: 0,
      totalTimeSpent: 0,
      totalBadges: 0,
    }));

    const statsMap = new Map(statsByDept.map(s => [s.id, s]));

    nonAdminUsers.forEach(user => {
      if (user.departmentId) {
        const stat = statsMap.get(user.departmentId);
        if (stat) {
          stat.userCount++;
          const userCompletion = user.quizzesPassed || 0;
          if (totalCourses > 0) {
              stat.totalCompletion += (userCompletion / totalCourses) * 100;
          }
          stat.totalTimeSpent += user.totalTimeSpent || 0;
          stat.totalBadges += user.badges?.length || 0;
        }
      }
    });
    
    return Array.from(statsMap.values()).map(stat => ({
        ...stat,
        avgCompletion: stat.userCount > 0 ? Math.round(stat.totalCompletion / stat.userCount) : 0,
        avgTimePerUser: stat.userCount > 0 ? formatTimeInHours(stat.totalTimeSpent / stat.userCount) : '0m',
        totalTimeHours: stat.totalTimeSpent / 3600,
      })).filter(stat => stat.userCount > 0);
  }, [nonAdminUsers]);
  
  const overallStats = useMemo(() => {
    if (!nonAdminUsers) return { totalUsers: 0, avgCompletion: 0, totalTime: '0h', totalBadges: 0 };

    const totalCourses = allBadges.length;
    let totalCompletionSum = 0;
    let totalTimeSum = 0;
    let totalBadgesSum = 0;

    nonAdminUsers.forEach(user => {
        const userCompletion = user.quizzesPassed || 0;
        if (totalCourses > 0) {
            totalCompletionSum += (userCompletion / totalCourses) * 100;
        }
        totalTimeSum += user.totalTimeSpent || 0;
        totalBadgesSum += user.badges?.length || 0;
    });

    return {
      totalUsers: nonAdminUsers.length,
      avgCompletion: nonAdminUsers.length > 0 ? Math.round(totalCompletionSum / nonAdminUsers.length) : 0,
      totalTime: formatTimeInHours(totalTimeSum),
      totalBadges: totalBadgesSum,
    };
  }, [nonAdminUsers]);

  const isLoading = isLoadingUsers || isAuthLoading;

  if (isAuthLoading) {
    return (
        <div className="space-y-6">
            <Skeleton className="h-8 w-1/3" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {Array.from({length: 4}).map((_, i) => <Skeleton key={i} className="h-28" />)}
            </div>
            <div className="grid gap-6 md:grid-cols-2">
                 <Skeleton className="h-80" />
                 <Skeleton className="h-80" />
            </div>
            <Skeleton className="h-96" />
        </div>
    )
  }

  if (!isAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Accès refusé</CardTitle>
          <CardDescription>
            Cette page est réservée aux administrateurs.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Tableau de bord administrateur</h1>
        <p className="text-muted-foreground">
          Vue d'ensemble des statistiques de conformité de l'organisation.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Utilisateurs Actifs</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{overallStats.totalUsers}</div>
                    <p className="text-xs text-muted-foreground">
                        (Administrateurs exclus)
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Complétion Moyenne</CardTitle>
                    <BookCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{overallStats.avgCompletion}%</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Temps de Formation Total</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{overallStats.totalTime}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Badges Obtenus</CardTitle>
                    <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{overallStats.totalBadges}</div>
                </CardContent>
            </Card>
        </div>


      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle>Taux de complétion par département</CardTitle>
                <CardDescription>Pourcentage moyen de cours terminés par les utilisateurs de chaque département.</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={departmentStats}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} interval={0} fontSize={12} />
                        <YAxis unit="%" />
                        <Tooltip formatter={(value: number) => `${value}%`} />
                        <Legend />
                        <Bar dataKey="avgCompletion" fill="var(--color-chart-1)" name="Complétion" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Temps de formation par département (en heures)</CardTitle>
                <CardDescription>Temps total consacré à la formation par les utilisateurs de chaque département.</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={departmentStats}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={
-45} textAnchor="end" height={80} interval={0} fontSize={12} />
                        <YAxis unit="h" />
                        <Tooltip formatter={(value: number) => `${value.toFixed(1)}h`} />
                        <Legend />
                        <Bar dataKey="totalTimeHours" fill="var(--color-chart-2)" name="Heures" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Statistiques par Département et Délégation</CardTitle>
          <CardDescription>
            Analyse détaillée de la performance de chaque entité.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Département / Délégation</TableHead>
                <TableHead className="text-center">Utilisateurs</TableHead>
                <TableHead className="w-[200px]">Complétion</TableHead>
                <TableHead className="text-center">Temps Moyen / Utilisateur</TableHead>
                <TableHead className="text-right">Badges Obtenus</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
                {departmentStats.map((dept) => (
                    <TableRow key={dept.id}>
                        <TableCell className="font-medium">{dept.name}</TableCell>
                        <TableCell className="text-center">{dept.userCount}</TableCell>
                        <TableCell>
                            <div className="flex items-center gap-2">
                                <Progress value={dept.avgCompletion} className="h-2" />
                                <span className="text-xs font-semibold">{dept.avgCompletion}%</span>
                            </div>
                        </TableCell>
                        <TableCell className="text-center">{dept.avgTimePerUser}</TableCell>
                        <TableCell className="text-right">{dept.totalBadges}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
