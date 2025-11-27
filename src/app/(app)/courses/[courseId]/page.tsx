'use client';
import { useState } from 'react';
import { useDoc, useFirestore, useUser, useMemoFirebase } from '@/firebase';
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
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { EditCourseForm } from '@/components/app/courses/edit-course-form';

function VideoPlayer({ url }: { url: string }) {
    return (
        <div className="aspect-video w-full">
        <video
            controls
            src={url}
            className="w-full h-full rounded-lg bg-black"
        >
            Votre navigateur ne supporte pas la balise vidéo.
        </video>
        </div>
    );
}

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const firestore = useFirestore();
  const { userProfile } = useUser();
  const [isEditing, setIsEditing] = useState(false);

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
  const isAdmin = userProfile?.role === 'admin';

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
  
  if (isEditing) {
    return <EditCourseForm course={course} onFinished={() => setIsEditing(false)} />
  }

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-start">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">{course.title}</h1>
            <Badge variant="secondary" className="mt-2">{course.category}</Badge>
        </div>
        {isAdmin && (
            <Button onClick={() => setIsEditing(true)} variant="outline">
                <Pencil className="mr-2 h-4 w-4" />
                Modifier le cours
            </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            <Card>
                 {image && !course.videoUrl && (
                    <Image
                        src={image.imageUrl}
                        alt={course.title}
                        width={800}
                        height={400}
                        className="rounded-t-lg object-cover w-full aspect-video"
                        data-ai-hint={image.imageHint}
                    />
                )}
                {course.videoUrl && (
                    <div className="p-6">
                        <VideoPlayer url={course.videoUrl} />
                    </div>
                )}
                <CardHeader>
                    <CardTitle>Description du cours</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{course.description}</p>
                </CardContent>
            </Card>

            {course.markdownContent && (
                <Card>
                    <CardHeader>
                        <CardTitle>Contenu du cours</CardTitle>
                    </CardHeader>
                    <CardContent className="prose dark:prose-invert max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: course.markdownContent.replace(/\n/g, '<br />') }} />
                    </CardContent>
                </Card>
            )}
        </div>
        <div>
           <Quiz 
              quiz={quiz} 
              isQuizLoading={isQuizLoading}
              courseId={courseId} 
              quizId={quizId as string}
            />
        </div>
      </div>
    </div>
  );
}
