'use client';
import { useDoc, useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, collection } from 'firebase/firestore';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';
import { Quiz } from '@/components/app/courses/quiz';
import { Skeleton } from '@/components/ui/skeleton';

export default function CourseDetailPage({ params }: { params: { courseId: string } }) {
  const { courseId } = params;
  const firestore = useFirestore();

  const courseRef = useMemoFirebase(() => {
    if (!firestore || !courseId) return null;
    return doc(firestore, 'courses', courseId);
  }, [firestore, courseId]);

  const { data: course, isLoading: isCourseLoading } = useDoc(courseRef);
  const quizId = course?.quizId;

  const quizRef = useMemoFirebase(() => {
    if (!firestore || !courseId || !quizId) return null;
    return doc(collection(firestore, 'courses', courseId, 'quizzes'), quizId);
  }, [firestore, courseId, quizId]);
  
  const { data: quiz, isLoading: isQuizLoading } = useDoc(quizRef);

  const getImage = (id: string) => {
    return PlaceHolderImages.find((img) => img.id === id);
  };
  const image = course ? getImage(course.image) : null;

  if (isCourseLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-6 w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
             <Skeleton className="h-64 w-full" />
             <Skeleton className="h-4 w-full" />
             <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="space-y-4">
             <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!course) {
    return <div>Cours non trouvé.</div>;
  }

  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-3xl font-bold tracking-tight">{course.title}</h1>
        <Badge variant="secondary" className="mt-2">{course.category}</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <Card>
                 {image && (
                    <Image
                        src={image.imageUrl}
                        alt={course.title}
                        width={800}
                        height={400}
                        className="rounded-t-lg object-cover w-full aspect-video"
                        data-ai-hint={image.imageHint}
                    />
                )}
                <CardHeader>
                    <CardTitle>Description du cours</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{course.description}</p>
                </CardContent>
            </Card>
        </div>
        <div>
           <Quiz 
              quiz={quiz} 
              isQuizLoading={isQuizLoading}
              courseId={courseId} 
              quizId={quizId}
            />
        </div>
      </div>
    </div>
  );
}
