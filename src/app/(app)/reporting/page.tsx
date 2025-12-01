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
import { reportingData } from '@/lib/data';
import { CompletionChart } from '@/components/app/reporting/completion-chart';
import { SuccessChart } from '@/components/app/reporting/success-chart';
import { Heatmap } from '@/components/app/reporting/heatmap';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection } from 'firebase/firestore';
import { useMemo } from 'react';

type UserProfile = {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
}

export default function ReportingPage() {
  const firestore = useFirestore();
  const { userProfile } = useUser();
  const isAdmin = userProfile?.role === 'admin';

  const usersQuery = useMemoFirebase(() => {
    // Only admins can fetch all users
    if (!firestore || !isAdmin) return null;
    return collection(firestore, 'users');
  }, [firestore, isAdmin]);

  const { data: users, isLoading } = useCollection<UserProfile>(usersQuery);

  const heatmapData = useMemo(() => {
    const topics = ['LAB/FT', 'KYC', 'Fraude', 'RGPD', 'Sanctions'];

    const generateScoresForUser = (user: UserProfile) => {
        const userScores: { user: string; [key: string]: string | number } = {
          user: user.firstName || user.email,
        };
        topics.forEach(topic => {
          userScores[topic] = Math.floor(Math.random() * (100 - 60 + 1) + 60);
        });
        return userScores;
    };

    if (isAdmin) {
        if (!users) return [];
        return users.map(generateScoresForUser);
    } 
    
    if (userProfile) {
        return [generateScoresForUser(userProfile as UserProfile)];
    }

    return [];
  }, [users, isAdmin, userProfile]);


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
            <CardTitle>Taux d'achèvement des cours</CardTitle>
            <CardDescription>Taux d'achèvement mensuel pour tous les cours actifs.</CardDescription>
          </CardHeader>
          <CardContent>
            <CompletionChart data={reportingData.completionRate} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Taux de réussite par département</CardTitle>
            <CardDescription>Taux de réussite moyen aux quiz pour chaque unité commerciale.</CardDescription>
          </CardHeader>
          <CardContent>
            <SuccessChart data={reportingData.successRate} />
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
