'use client';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useDoc } from '@/firebase/firestore/use-doc';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useFirestore } from '@/firebase/provider';
import { useUser } from '@/firebase/auth/use-user';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { doc, collection, increment } from 'firebase/firestore';
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
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Pencil, BookOpenCheck } from 'lucide-react';
import { EditCourseForm } from '@/components/app/courses/edit-course-form';
import { DeleteCourseDialog } from '@/components/app/courses/delete-course-dialog';
import { GoogleDrivePdfViewer } from '@/components/app/courses/google-drive-pdf-viewer';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { staticCourses, type Course, type QuizData } from '@/lib/quiz-data';
import { getGoogleDriveImageUrl } from '@/lib/utils';

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
  const router = useRouter();
  const courseId = params.courseId as string;
  const firestore = useFirestore();
  const { user, userProfile } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [isContentReviewed, setIsContentReviewed] = useState(false);
  const [isStatic, setIsStatic] = useState(false);

  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [currentQuiz, setCurrentQuiz] = useState<QuizData | null>(null);
  const [allCourses, setAllCourses] = useState<Course[]>([]);

  // Time tracking logic
  const lastSaveTimeRef = useRef<number>(Date.now());
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);

  const courseRef = useMemo(() => {
    if (!firestore || !courseId) return null;
    return doc(firestore, 'courses', courseId);
  }, [firestore, courseId]);

  const { data: courseFromDb, isLoading: isCourseLoading, error: courseError } = useDoc<Course>(courseRef);

  // Consolidate quizId logic
  const quizId = useMemo(() => {
    // This logic must be robust. Prioritize DB data, then static.
    if (courseFromDb) return courseFromDb.quizId;
    const staticCourse = staticCourses.find(c => c.id === courseId);
    // Use optional chaining for safety
    return staticCourse?.quiz?.id || staticCourse?.quizId;
  }, [courseFromDb, courseId]);

  /* Fix: Stabilize saveTimeSpent by removing full user object dependency */
  const saveTimeSpent = useCallback(() => {
    if (!user?.uid || !firestore) {
      return;
    }

    const now = Date.now();
    const timeDiffInSeconds = Math.round((now - lastSaveTimeRef.current) / 1000);

    /* Only update if meaningful time passed (e.g. > 1s) to avoid spamming writes on quick re-renders */
    if (timeDiffInSeconds > 1) {
      const userRef = doc(firestore, 'users', user.uid);
      updateDocumentNonBlocking(userRef, {
        totalTimeSpent: increment(timeDiffInSeconds)
      });
      lastSaveTimeRef.current = now; // Reset timer after saving
    }
  }, [user?.uid, firestore]);

  const handleQuizSubmit = useCallback(() => {
    saveTimeSpent();
    router.refresh();
  }, [saveTimeSpent, router]);

  useEffect(() => {
    // Initialize timer reference
    lastSaveTimeRef.current = Date.now();

    // Clear any existing interval
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
    }

    // Set new interval
    intervalIdRef.current = setInterval(() => {
      saveTimeSpent();
    }, 60000);

    return () => {
      // Save on unmount
      saveTimeSpent();
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    };
    /* Remove 'user' and 'quizId' from dependencies to prevent timer resets on unrelated prop changes. 
       We only need to restart if saveTimeSpent (which depends on user.uid) changes. */
  }, [saveTimeSpent]);

  // --- Fetch all courses for "Next Course" navigation ---
  const coursesQuery = useMemo(() => {
    if (!firestore) return null;
    return collection(firestore, 'courses');
  }, [firestore]);

  const { data: dynamicCourses, isLoading: isLoadingCourses } = useCollection<Course>(coursesQuery);

  useEffect(() => {
    if (!isLoadingCourses) {
      const dynamicCourseIds = new Set(dynamicCourses?.map(c => c.id) || []);
      const uniqueStaticCourses = staticCourses.filter(c => !dynamicCourseIds.has(c.id));
      setAllCourses([...uniqueStaticCourses, ...(dynamicCourses || [])]);
    }
  }, [dynamicCourses, isLoadingCourses]);
  // --- End of fetching all courses ---

  const quizRef = useMemo(() => {
    if (!firestore || !courseId || !quizId || !courseFromDb) return null;
    // If the course is static, we don't fetch its quiz from DB
    if (!courseFromDb && staticCourses.some(c => c.id === courseId)) return null;
    return doc(collection(firestore, 'courses', courseId, 'quizzes'), quizId);
  }, [firestore, courseId, quizId, courseFromDb]);

  const { data: quizFromDb, isLoading: isQuizLoadingFromDb } = useDoc<QuizData>(quizRef);

  useEffect(() => {
    // If we get a course from DB, it takes precedence
    if (courseFromDb) {
      setCurrentCourse(courseFromDb);
      setIsStatic(false);
      if (quizFromDb) {
        setCurrentQuiz(quizFromDb);
      } else if (!isQuizLoadingFromDb) {
        // Course from DB but no quiz from DB, check static
        const staticMatch = staticCourses.find(sc => sc.id === courseId);
        setCurrentQuiz(staticMatch?.quiz || null);
      }
    } else if (!isCourseLoading) {
      // Otherwise, check static courses
      const staticCourse = staticCourses.find(c => c.id === courseId);
      if (staticCourse) {
        setCurrentCourse(staticCourse);
        setCurrentQuiz(staticCourse.quiz || null);
        setIsStatic(true);
      }
    }
  }, [courseId, courseFromDb, isCourseLoading, quizFromDb, isQuizLoadingFromDb]);

  const hasPassedQuiz = userProfile?.completedQuizzes?.includes(quizId as string);

  useEffect(() => {
    if (hasPassedQuiz) {
      setIsContentReviewed(true);
    }
  }, [hasPassedQuiz]);

  const isLoading = isCourseLoading || isLoadingCourses;
  const isQuizLoading = isQuizLoadingFromDb || (isCourseLoading && !currentCourse);

  const getImageUrl = (imageIdentifier: string | undefined): string => {
    if (!imageIdentifier) return PlaceHolderImages[PlaceHolderImages.length - 1].imageUrl; // Default image
    if (imageIdentifier.startsWith('http')) {
      return getGoogleDriveImageUrl(imageIdentifier);
    }
    const placeholder = PlaceHolderImages.find((img) => img.id === imageIdentifier);
    return placeholder ? placeholder.imageUrl : PlaceHolderImages[PlaceHolderImages.length - 1].imageUrl;
  };

  const imageUrl = getImageUrl(currentCourse?.image);
  const isAdmin = userProfile?.role === 'admin';
  const hasContent = currentCourse && (currentCourse.videoUrl || currentCourse.pdfUrl || currentCourse.markdownContent);

  const isQuizLocked = hasContent && !isContentReviewed && !isAdmin;
  const isContentLockedForUser = isContentReviewed && !isAdmin && !hasPassedQuiz;
  // const isContentLockedForUser = false; // Reverted Open Book mode

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-6 w-1/3" />
        <div className="space-y-4">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    )
  }

  if (courseError) {
    return (
      <div className="p-8">
        <div className="text-red-500 mb-4 p-4 border border-red-200 rounded-md bg-red-50">
          <h2 className="text-lg font-bold">Erreur</h2>
          <p>Impossible de charger le cours : {(courseError as Error).message}</p>
          <p className="text-sm mt-1">Si le problème persiste, veuillez contacter le support.</p>
        </div>
        <Button onClick={() => router.push('/courses')}>Retour aux cours</Button>
      </div>
    );
  }

  if (!currentCourse) {
    return <div>Cours non trouvé. Il a peut-être été supprimé.</div>;
  }

  if (isEditing && currentCourse) {
    return <EditCourseForm
      course={currentCourse}
      quiz={currentQuiz}
      isStatic={isStatic}
      onFinished={() => setIsEditing(false)}
    />
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{currentCourse.title}</h1>
          <Badge variant="secondary" className="mt-2">{currentCourse.category}</Badge>
        </div>
        {isAdmin && (
          <div className="flex gap-2">
            <Button onClick={() => setIsEditing(true)} variant="outline">
              <Pencil className="mr-2 h-4 w-4" />
              Modifier
            </Button>
            <DeleteCourseDialog courseId={currentCourse.id} isStatic={isStatic} />
          </div>
        )}
      </div>

      {!isContentLockedForUser ? (
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Description du cours</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-2 flex justify-center">
                <Image
                  src={imageUrl}
                  alt={currentCourse.title}
                  width={400}
                  height={225}
                  className="rounded-lg object-cover"
                />
              </div>
              {currentCourse.videoUrl && currentCourse.videoUrl.trim() !== '' && (
                <div className="p-2">
                  <VideoPlayer url={currentCourse.videoUrl} />
                </div>
              )}
              <p className="text-muted-foreground p-2">{currentCourse.description}</p>
            </CardContent>
          </Card>

          {currentCourse.pdfUrl && currentCourse.pdfUrl.trim() !== '' && (
            <GoogleDrivePdfViewer url={currentCourse.pdfUrl} />
          )}

          {currentCourse.markdownContent && typeof currentCourse.markdownContent === 'string' && currentCourse.markdownContent.trim() !== '' && (
            <Card>
              <CardHeader>
                <CardTitle>Contenu du cours</CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: currentCourse.markdownContent.replace(/\n/g, '<br />') }} />
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Contenu examiné</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground bg-muted/30 rounded-lg">
            <BookOpenCheck className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold text-foreground">Vous avez terminé votre lecture.</h3>
            <p className="mt-2 max-w-xs">
              Il est maintenant temps de tester vos connaissances. Veuillez répondre au quiz ci-dessous.
            </p>
          </CardContent>
        </Card>
      )}

      {hasContent && !hasPassedQuiz && (
        <Card>
          <CardContent className="p-6 flex items-center space-x-2">
            <Checkbox
              id="content-reviewed"
              checked={isContentReviewed}
              onCheckedChange={(checked) => setIsContentReviewed(checked as boolean)}
              disabled={isContentReviewed && !isAdmin}
            />
            <Label htmlFor="content-reviewed" className="font-medium cursor-pointer">
              Je confirme avoir lu et compris le contenu ci-dessus.
            </Label>
          </CardContent>
        </Card>
      )}

      <div>
        <Quiz
          quiz={currentQuiz}
          isQuizLoading={isQuizLoading}
          courseId={courseId}
          quizId={quizId as string}
          isLocked={isQuizLocked}
          isStatic={isStatic}
          allCourses={allCourses}
          onQuizSubmit={handleQuizSubmit}
        />
      </div>
    </div>
  );
}
