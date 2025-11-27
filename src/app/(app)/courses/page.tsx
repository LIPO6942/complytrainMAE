'use client';

import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCollection, useUser, useFirestore, addDocumentNonBlocking, useMemoFirebase } from '@/firebase';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { collection } from 'firebase/firestore';

export default function CoursesPage() {
  const { userProfile } = useUser();
  const firestore = useFirestore();

  const coursesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'courses');
  }, [firestore]);
  
  const { data: courses, isLoading } = useCollection(coursesQuery);

  const getImage = (id: string) => {
    return PlaceHolderImages.find((img) => img.id === id);
  };

  const handleAddCourse = () => {
    if (!firestore) return;
    const newCourse = {
      title: 'Nouveau Quiz Thématique',
      category: 'Quiz',
      image: 'course-new',
      description: 'Un nouveau quiz thématique prêt à être configuré.',
      quizId: 'new-quiz', // Default quizId for new courses
    };
    const coursesCollection = collection(firestore, 'courses');
    addDocumentNonBlocking(coursesCollection, newCourse);
  };

  const isAdmin = userProfile?.role === 'admin';

  return (
    <div>
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Cours sur la conformité</h1>
            {isAdmin && (
                <Button onClick={handleAddCourse}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Ajouter un cours
                </Button>
            )}
        </div>
        {isLoading && <p>Chargement des cours...</p>}
        {!isLoading && courses && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => {
                    const image = getImage(course.image);
                    return (
                    <Link href={`/courses/${course.id}`} key={course.id} className="flex">
                      <Card className="flex flex-col w-full hover:border-primary transition-colors">
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
                      </Card>
                    </Link>
                    );
                })}
            </div>
        )}
        {!isLoading && courses?.length === 0 && (
             <div className="text-center py-10">
                <p>Aucun cours n'a été trouvé. Les administrateurs peuvent en ajouter.</p>
            </div>
        )}
    </div>
  );
}
