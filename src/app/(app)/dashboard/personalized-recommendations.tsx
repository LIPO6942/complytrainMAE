'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { personalizedRiskRecommendations, type PersonalizedRiskRecommendationsOutput } from '@/ai/flows/personalized-risk-recommendations';
import { BookMarked, Target, AlertTriangle, ArrowRight } from 'lucide-react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { collection } from 'firebase/firestore';
import { staticCourses, type Course } from '@/lib/quiz-data';
import { Button } from '@/components/ui/button';

type Recommendation = PersonalizedRiskRecommendationsOutput['recommendations'][0];

export function PersonalizedRecommendations() {
  const { userProfile, isUserLoading } = useUser();
  const firestore = useFirestore();

  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dynamic courses
  const coursesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'courses');
  }, [firestore]);
  const { data: dynamicCourses, isLoading: isLoadingCourses } = useCollection<Course>(coursesQuery);

  // Combine static and dynamic courses
  const allCourses = useMemo(() => {
    const courses = [...staticCourses];
    if (dynamicCourses) {
      // Ensure we don't have duplicates if a static course was made dynamic
      const staticIds = new Set(staticCourses.map(c => c.id));
      const filteredDynamic = dynamicCourses.filter(c => !staticIds.has(c.id));
      courses.push(...filteredDynamic);
    }
    return courses.map(c => ({ id: c.id, title: c.title, description: c.description }));
  }, [dynamicCourses]);


  useEffect(() => {
    async function fetchRecommendations() {
      // Wait for both user and courses to be loaded
      if (isUserLoading || isLoadingCourses) {
        return;
      }
      
      // If no profile or no courses, stop.
      if (!userProfile || allCourses.length === 0) {
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
          riskProfile,
          courses: allCourses,
        });

        if (result && result.recommendations) {
            setRecommendations(result.recommendations);
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
  }, [userProfile, isUserLoading, allCourses, isLoadingCourses]);

  const showSkeleton = isLoading || isUserLoading || isLoadingCourses;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="text-primary" />
          <span>Recommandations Personnalisées</span>
        </CardTitle>
        <CardDescription>
          En fonction de votre profil, nous vous suggérons de vous concentrer sur ces domaines.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {showSkeleton && (
            <div className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
            </div>
        )}
        {!showSkeleton && error && (
          <div className="flex flex-col items-center justify-center text-center text-muted-foreground bg-muted/50 p-4 rounded-lg">
            <AlertTriangle className="h-8 w-8 mb-2 text-destructive" />
            <p className="font-semibold text-foreground">Erreur de chargement</p>
            <p className="text-sm">{error}</p>
          </div>
        )}
        {!showSkeleton && !error && recommendations.length > 0 && (
          <div className="space-y-3">
            {recommendations.map((rec) => (
              <Button asChild variant="outline" className="w-full justify-start h-auto" key={rec.courseId}>
                <Link href={`/courses/${rec.courseId}`}>
                  <div className="flex items-center gap-4 p-2">
                    <BookMarked className="h-6 w-6 text-accent shrink-0" />
                    <span className="text-sm font-medium whitespace-normal text-left">{rec.title}</span>
                    <ArrowRight className="h-4 w-4 ml-auto" />
                  </div>
                </Link>
              </Button>
            ))}
          </div>
        )}
        {!showSkeleton && !error && recommendations.length === 0 && (
            <p className="text-sm text-muted-foreground text-center p-4">Aucune recommandation pour le moment.</p>
        )}
      </CardContent>
    </Card>
  );
}
