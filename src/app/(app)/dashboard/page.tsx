'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { learningPath } from '@/lib/data';
import { AITutor } from './ai-tutor';
import { EarnedBadges } from './earned-badges';
import { useUser } from '@/firebase';
import { PersonalizedRecommendations } from './personalized-recommendations';

export default function DashboardPage() {
  const { userProfile } = useUser();
  const displayName = userProfile?.firstName || 'Utilisateur';
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="lg:col-span-4">
        <CardHeader>
          <CardTitle>Bonjour, {displayName} !</CardTitle>
          <CardDescription>
            Voici un résumé de votre progression en formation de conformité.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {learningPath.map((path) => (
            <div key={path.title}>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">{path.title}</h3>
                <span className="text-sm text-muted-foreground">
                  {path.completion}% Terminé
                </span>
              </div>
              <Progress value={path.completion} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>
      <div className="lg:col-span-3 space-y-4">
        <PersonalizedRecommendations />
        <EarnedBadges />
      </div>
       <AITutor />
    </div>
  );
}
