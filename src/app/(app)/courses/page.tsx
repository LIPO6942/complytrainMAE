
'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useUser } from '@/firebase/auth/use-user';
import { useFirestore } from '@/firebase/provider';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';
import { collection } from 'firebase/firestore';
import { DeleteCourseDialog } from '@/components/app/courses/delete-course-dialog';
import { Button } from '@/components/ui/button';
import { Trash2, CheckCircle, XCircle } from 'lucide-react';
import { AddCourseDialog } from '@/components/app/courses/add-course-dialog';
import { staticCourses, type Course } from '@/lib/quiz-data';
import { getGoogleDriveImageUrl } from '@/lib/utils';
import { cn } from '@/lib/utils';


export default function CoursesPage() {
  const { userProfile } = useUser();
  const firestore = useFirestore();

  const [hiddenStaticCourses, setHiddenStaticCourses] = useState<string[]>([]);

  const coursesQuery = useMemo(() => {
    if (!firestore) return null;
    return collection(firestore, 'courses');
  }, [firestore]);

  const { data: dynamicCourses, isLoading } = useCollection(coursesQuery);

  const allCourses = useMemo(() => {
    const dynamicCourseIds = new Set(dynamicCourses?.map(c => c.id) || []);
    // Filter out static courses that have a dynamic counterpart
    const uniqueStaticCourses = staticCourses.filter(c => !dynamicCourseIds.has(c.id));

    const visibleStaticCourses = uniqueStaticCourses.filter(c => !hiddenStaticCourses.includes(c.id));

    const combined = [...visibleStaticCourses, ...(dynamicCourses || [])];
    return combined.sort((a, b) => a.title.localeCompare(b.title));
  }, [dynamicCourses, hiddenStaticCourses]);


  const handleCourseDeleted = (courseId: string) => {
    // This is for visually hiding static courses
    const isStatic = staticCourses.some(c => c.id === courseId);
    if (isStatic) {
      setHiddenStaticCourses(prev => [...prev, courseId]);
    }
  };

  const getImageUrl = (imageIdentifier: string | undefined): string => {
    if (!imageIdentifier) return PlaceHolderImages[PlaceHolderImages.length - 1].imageUrl;
    if (imageIdentifier.startsWith('http')) {
      return getGoogleDriveImageUrl(imageIdentifier);
    }
    const placeholder = PlaceHolderImages.find((img) => img.id === imageIdentifier);
    return placeholder ? placeholder.imageUrl : PlaceHolderImages[PlaceHolderImages.length - 1].imageUrl;
  };

  const isAdmin = userProfile?.role === 'admin';

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Cours sur la conformité</h1>
        {isAdmin && <AddCourseDialog />}
      </div>
      {isLoading && <p>Chargement des cours...</p>}
      {!isLoading && allCourses && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allCourses.map((course) => {
            const imageUrl = getImageUrl(course.image);
            const isStatic = 'isStatic' in course && course.isStatic;
            const quizId = course.quiz?.id || course.quizId;

            const score = userProfile?.scores?.[quizId as string];
            const hasAttempted = typeof score === 'number';
            const hasPassed = hasAttempted && score >= 60;

            const borderClass = hasAttempted
              ? (hasPassed ? "border-green-600/50" : "border-red-600/50")
              : "";

            return (
              <Card key={course.id} className={cn("flex flex-col w-full group/card relative transition-all", borderClass)}>
                {hasAttempted && (
                  <div className={cn(
                    "absolute top-2 left-2 z-10 p-1.5 text-white rounded-full",
                    hasPassed ? "bg-green-600" : "bg-red-600"
                  )}>
                    {hasPassed ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                  </div>
                )}
                <Link href={`/courses/${course.id}`} className="flex flex-col w-full h-full hover:border-primary transition-colors">
                  <CardHeader>
                    <div className="relative h-40 w-full mb-4">
                      {imageUrl && (
                        <Image
                          src={imageUrl}
                          alt={course.title}
                          fill
                          className="rounded-lg object-cover"
                        />
                      )}
                      {hasAttempted && (
                        <div className="absolute inset-0 bg-background/50 rounded-lg"></div>
                      )}
                    </div>
                    <Badge variant="secondary" className="w-fit">{course.category}</Badge>
                    <CardTitle>{course.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                  </CardHeader>
                  <CardFooter className="mt-auto">
                    <p className="text-primary font-semibold text-sm">Voir les détails</p>
                  </CardFooter>
                </Link>
                {isAdmin && (
                  <div className="absolute top-2 right-2 opacity-0 group-hover/card:opacity-100 transition-opacity">
                    <DeleteCourseDialog
                      courseId={course.id}
                      isStatic={isStatic}
                      onDeleted={handleCourseDeleted}
                      trigger={
                        <Button variant="destructive" size="icon" className="h-8 w-8">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      }
                    />
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
      {!isLoading && allCourses?.length === 0 && (
        <div className="text-center py-10">
          <p>Aucun cours n'a été trouvé. Les administrateurs peuvent en ajouter.</p>
        </div>
      )}
    </div>
  );
}
