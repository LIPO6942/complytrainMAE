



import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { learningPath, user, allBadges } from '@/lib/data';
import { personalizedRiskRecommendations } from '@/ai/flows/personalized-risk-recommendations';
import { Award, Target, BookMarked, AlertTriangle } from 'lucide-react';
import { AITutor } from './ai-tutor';
import { useUser } from '@/firebase';

async function PersonalizedRecommendations() {
  try {
    const recommendations = await personalizedRiskRecommendations({
      riskProfile: user.riskProfile,
    });

    const recommendationItems = recommendations.recommendations
      .split('\n')
      .map((item) => item.replace(/^\d+\.\s/, ''))
      .filter(Boolean);

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
          <ul className="space-y-2 text-sm">
            {recommendationItems.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <BookMarked className="h-4 w-4 mt-1 shrink-0 text-accent" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    );
  } catch (error) {
    console.error("Failed to fetch personalized recommendations:", error);
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
          <div className="flex flex-col items-center justify-center text-center text-muted-foreground bg-muted/50 p-4 rounded-lg">
            <AlertTriangle className="h-8 w-8 mb-2 text-destructive" />
            <p className="font-semibold text-foreground">Erreur de chargement</p>
            <p className="text-sm">Les recommandations n'ont pas pu être chargées pour le moment.</p>
          </div>
        </CardContent>
      </Card>
    )
  }
}

function EarnedBadges() {
    const { userProfile } = useUser();
    const earnedBadgeIds = userProfile?.badges || [];
    const earnedBadges = allBadges.filter(badge => earnedBadgeIds.includes(badge.id));

    return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="text-primary" />
              <span>Badges Obtenus</span>
            </CardTitle>
            <CardDescription>
              Votre collection de jalons de conformité terminés.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            {earnedBadges.length > 0 ? (
                earnedBadges.map((badge) => {
                    const Icon = badge.icon;
                    return (
                        <div key={badge.id} className="flex flex-col items-center gap-2 text-center w-24">
                        {Icon ? (
                            <Icon className="w-16 h-16 text-accent" />
                        ) : (
                            <Award className="w-16 h-16 text-muted-foreground" />
                        )}
                        <div className="space-y-1">
                            <p className="font-semibold text-sm leading-tight">{badge.name}</p>
                            <p className="text-xs text-muted-foreground">{badge.description}</p>
                        </div>
                        </div>
                    );
                })
            ) : (
                <p className="text-sm text-muted-foreground">Aucun badge obtenu pour le moment. Terminez des quiz pour en gagner !</p>
            )}
          </CardContent>
        </Card>
    )
}

export default function DashboardPage() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="lg:col-span-4">
        <CardHeader>
          <CardTitle>Bonjour, {user.name.split(' ')[0]} !</CardTitle>
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
