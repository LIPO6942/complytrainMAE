
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AITutor } from './ai-tutor';
import { EarnedBadges } from './earned-badges';
import { useUser } from '@/firebase';
import { PersonalizedRecommendations } from './personalized-recommendations';
import { UserStats } from './user-stats';

export default function DashboardPage() {
  const { userProfile } = useUser();
  const displayName = userProfile?.firstName || 'Utilisateur';
  
  return (
    <div className="space-y-6">
       <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Bonjour, {displayName}!</h1>
          <p className="text-muted-foreground">
            Voici un résumé de votre progression en formation de conformité.
          </p>
        </div>

        <UserStats />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <PersonalizedRecommendations />
        </div>
        <div className="lg:col-span-2 space-y-6">
          <EarnedBadges />
        </div>
      </div>
      
      <div>
        <AITutor />
      </div>
    </div>
  );
}
