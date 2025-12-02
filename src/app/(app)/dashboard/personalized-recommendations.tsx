'use client';
import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { personalizedRiskRecommendations } from '@/ai/flows/personalized-risk-recommendations';
import { BookMarked, Target, AlertTriangle } from 'lucide-react';
import { useUser } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';

export function PersonalizedRecommendations() {
  const { userProfile, isUserLoading } = useUser();
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecommendations() {
      // Don't fetch until user profile is loaded
      if (isUserLoading) {
        return;
      }
      
      // Once loading is done, if there's still no profile, we can stop.
      if (!userProfile) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      
      const riskProfileParts = [
        `Département: ${userProfile.departmentId || 'Non assigné'}`,
        `Score moyen: ${userProfile.averageScore?.toFixed(0) ?? 'N/A'}%`,
        `Quiz tentés: ${userProfile.quizAttempts || 0}`,
      ];
      const riskProfile = riskProfileParts.join(', ');

      try {
        const result = await personalizedRiskRecommendations({
          riskProfile: riskProfile,
        });

        if (result && result.recommendations) {
            const recommendationItems = result.recommendations
            .split('\n')
            .map((item) => item.replace(/^\s*-\s*/, '')) // Remove leading dash and spaces
            .filter(Boolean);
            setRecommendations(recommendationItems);
        } else {
            setRecommendations([]);
        }
      } catch (e) {
        console.error("Failed to fetch personalized recommendations:", e);
        setError("Les recommandations n'ont pas pu être chargées pour le moment.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchRecommendations();
  }, [userProfile, isUserLoading]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="text-primary" />
          <span>Recommandations Personnalisées</span>
        </CardTitle>
        <CardDescription>
          En fonction de votre profil de risque, nous vous suggérons de vous concentrer sur ces domaines.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && (
            <div className="space-y-2">
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
                <Skeleton className="h-4 w-5/6" />
            </div>
        )}
        {!isLoading && error && (
          <div className="flex flex-col items-center justify-center text-center text-muted-foreground bg-muted/50 p-4 rounded-lg">
            <AlertTriangle className="h-8 w-8 mb-2 text-destructive" />
            <p className="font-semibold text-foreground">Erreur de chargement</p>
            <p className="text-sm">{error}</p>
          </div>
        )}
        {!isLoading && !error && recommendations.length > 0 && (
          <ul className="space-y-2 text-sm">
            {recommendations.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <BookMarked className="h-4 w-4 mt-1 shrink-0 text-accent" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}
        {!isLoading && !error && recommendations.length === 0 && (
            <p className="text-sm text-muted-foreground text-center">Aucune recommandation pour le moment.</p>
        )}
      </CardContent>
    </Card>
  );
}
