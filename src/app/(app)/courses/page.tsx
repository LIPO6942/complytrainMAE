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
import { ArrowRight, PlusCircle } from 'lucide-react';
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
      title: 'Nouveau Cours de Conformité',
      category: 'Conformité',
      image: 'course-new',
      description: 'Ceci est un nouveau cours ajouté par l\'administrateur.',
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
                    <Card key={course.id} className="flex flex-col">
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
                        <Button asChild className="w-full">
                            <Link href="#">
                            Voir le cours <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                        </CardFooter>
                    </Card>
                    );
                })}
            </div>
        )}
        {!isLoading && !courses && (
             <div className="text-center py-10">
                <p>Aucun cours n'a été trouvé. Les administrateurs peuvent en ajouter.</p>
            </div>
        )}
    </div>
  );
}
