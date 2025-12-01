'use client';
import { useState, useEffect } from 'react';
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
import { DeleteCourseDialog } from '@/components/app/courses/delete-course-dialog';
import { GoogleDrivePdfViewer } from '@/components/app/courses/google-drive-pdf-viewer';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { staticCourses, type Course, type QuizData } from '@/lib/quiz-data';

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
  const [isContentReviewed, setIsContentReviewed] = useState(false);
  const [isStatic, setIsStatic] = useState(false);
  
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [currentQuiz, setCurrentQuiz] = useState<QuizData | null>(null);

  const courseRef = useMemoFirebase(() => {
    if (!firestore || !courseId || isStatic) return null;
    return doc(firestore, 'courses', courseId);
  }, [firestore, courseId, isStatic]);

  const { data: courseFromDb, isLoading: isCourseLoading } = useDoc(courseRef);
  const quizId = courseFromDb?.quizId;

  const quizRef = useMemoFirebase(() => {
    if (!firestore || !courseId || !quizId || isStatic) return null;
    return doc(collection(firestore, 'courses', courseId, 'quizzes'), quizId);
  }, [firestore, courseId, quizId, isStatic]);
  
  const { data: quizFromDb, isLoading: isQuizLoading } = useDoc(quizRef);
  
  useEffect(() => {
    const staticCourse = staticCourses.find(c => c.id === courseId);
    if (staticCourse) {
        setCurrentCourse(staticCourse);
        setCurrentQuiz(staticCourse.quiz);
        setIsStatic(true);
    } else if (courseFromDb) {
        setCurrentCourse(courseFromDb as Course);
        if(quizFromDb) {
          setCurrentQuiz(quizFromDb);
        }
    }
  }, [courseId, courseFromDb, quizFromDb]);
  
  const isLoading = isCourseLoading || isQuizLoading;

  const getImage = (id: string) => {
    return PlaceHolderImages.find((img) => img.id === id);
  };
  const image = currentCourse ? getImage(currentCourse.image) : null;
  const isAdmin = userProfile?.role === 'admin';
  const hasContent = currentCourse && (currentCourse.videoUrl || currentCourse.pdfUrl || currentCourse.markdownContent);

  const isQuizLocked = hasContent && !isContentReviewed && !isAdmin;

  if (isLoading && !isStatic) {
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

  if (!currentCourse) {
    return <div>Cours non trouvé. Il a peut-être été supprimé.</div>;
  }
  
  if (isEditing && currentCourse && !isStatic) {
    return <EditCourseForm course={currentCourse} onFinished={() => setIsEditing(false)} />
  }

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-start">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">{currentCourse.title}</h1>
            <Badge variant="secondary" className="mt-2">{currentCourse.category}</Badge>
        </div>
        {isAdmin && (
            <div className="flex gap-2">
                {!isStatic && (
                    <Button onClick={() => setIsEditing(true)} variant="outline">
                        <Pencil className="mr-2 h-4 w-4" />
                        Modifier le cours
                    </Button>
                )}
                <DeleteCourseDialog courseId={currentCourse.id} isStatic={isStatic} />
            </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            <Card>
                 {currentCourse.videoUrl && currentCourse.videoUrl.trim() !== '' ? (
                    <div className="p-6">
                        <VideoPlayer url={currentCourse.videoUrl} />
                    </div>
                ) : image && (
                    <Image
                        src={image.imageUrl}
                        alt={currentCourse.title}
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
                    <p className="text-muted-foreground">{currentCourse.description}</p>
                </CardContent>
            </Card>

            {currentCourse.pdfUrl && currentCourse.pdfUrl.trim() !== '' && (
                <GoogleDrivePdfViewer url={currentCourse.pdfUrl} />
            )}

            {currentCourse.markdownContent && currentCourse.markdownContent.trim() !== '' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Contenu du cours</CardTitle>
                    </CardHeader>
                    <CardContent className="prose dark:prose-invert max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: currentCourse.markdownContent.replace(/\n/g, '<br />') }} />
                    </CardContent>
                </Card>
            )}

            {hasContent && (
              <Card>
                <CardContent className="p-6 flex items-center space-x-2">
                  <Checkbox 
                    id="content-reviewed" 
                    checked={isContentReviewed} 
                    onCheckedChange={(checked) => setIsContentReviewed(checked as boolean)}
                    disabled={isAdmin}
                  />
                  <Label htmlFor="content-reviewed" className="font-medium cursor-pointer">
                    Je confirme avoir lu et compris le contenu ci-dessus.
                  </Label>
                </CardContent>
              </Card>
            )}
        </div>
        <div>
           <Quiz 
              quiz={currentQuiz} 
              isQuizLoading={isLoading && !isStatic}
              courseId={courseId} 
              quizId={quizId as string}
              isLocked={isQuizLocked}
              isStatic={isStatic}
            />
        </div>
      </div>
    </div>
  );
}
