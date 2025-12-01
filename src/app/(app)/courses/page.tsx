'use client';

import Image from 'next/image';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCollection, useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';
import { collection } from 'firebase/firestore';
import { DeleteCourseDialog } from '@/components/app/courses/delete-course-dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { AddCourseDialog } from '@/components/app/courses/add-course-dialog';
import { staticCourses, type Course } from '@/lib/quiz-data';

export default function CoursesPage() {
  const { userProfile } = useUser();
  const firestore = useFirestore();

  const [hiddenStaticCourses, setHiddenStaticCourses] = useState<string[]>([]);

  const coursesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'courses');
  }, [firestore]);
  
  const { data: dynamicCourses, isLoading } = useCollection(coursesQuery);

  const visibleStaticCourses = staticCourses.filter(c => !hiddenStaticCourses.includes(c.id));
  const allCourses = [...visibleStaticCourses, ...(dynamicCourses || [])];

  const handleCourseDeleted = (courseId: string) => {
    // This is for visually hiding static courses
    const isStatic = staticCourses.some(c => c.id === courseId);
    if (isStatic) {
      setHiddenStaticCourses(prev => [...prev, courseId]);
    }
  };

  const getImage = (id: string) => {
    return PlaceHolderImages.find((img) => img.id === id);
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
                    const image = getImage(course.image);
                    const isStatic = 'isStatic' in course && course.isStatic;
                    return (
                      <Card key={course.id} className="flex flex-col w-full group/card relative">
                          <Link href={`/courses/${course.id}`} className="flex flex-col w-full h-full hover:border-primary transition-colors">
                            <CardHeader>
                            <div className="relative h-40 w-full mb-4">
                                {image && (
                                <Image
                                    src={image.imageUrl}
                                    alt={course.title}
                                    fill
                                    className="rounded-lg object-cover"
                                    data-ai-hint={image.imageHint}
                                />
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
