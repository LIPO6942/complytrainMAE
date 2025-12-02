'use client';
import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useUser, useFirestore, setDocumentNonBlocking } from '@/firebase';
import { doc, arrayUnion, runTransaction, increment } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Lock, Award, ShieldQuestion, CheckCircle2, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import type { QuizData, Question, Course } from '@/lib/quiz-data';
import { allBadges } from '@/lib/data';
import { useRouter } from 'next/navigation';

interface QuizProps {
    quiz: QuizData | null;
    isQuizLoading: boolean;
    courseId: string;
    quizId: string;
    isLocked: boolean;
    isStatic?: boolean;
    allCourses: Course[];
}

export function Quiz({ quiz, isQuizLoading, courseId, quizId, isLocked, isStatic, allCourses }: QuizProps) {
  const { user, userProfile } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  const isAdmin = userProfile?.role === 'admin';
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number[]>>({});
  const [showResults, setShowResults] = useState(false);
  const [finalScore, setFinalScore] = useState<number | null>(null);

  const hasAlreadyPassed = userProfile?.completedQuizzes?.includes(quizId);
  
  const handleNextCourse = () => {
    const currentIndex = allCourses.findIndex(c => c.id === courseId);
    if (currentIndex > -1 && currentIndex < allCourses.length - 1) {
      const nextCourse = allCourses[currentIndex + 1];
      router.push(`/courses/${nextCourse.id}`);
    } else {
      toast({ title: 'Félicitations !', description: 'Vous avez terminé tous les cours disponibles.' });
    }
  };

   useEffect(() => {
    // If the user has already passed, immediately show the results/completed state.
    if (hasAlreadyPassed) {
      setShowResults(true);
      // We don't store individual scores, so we can't set it here.
      // We just show the completion state.
    } else {
        // Reset state if quiz changes and hasn't been passed
        setShowResults(false);
        setFinalScore(null);
        setSelectedAnswers({});
    }
  }, [hasAlreadyPassed, quizId]);

  if (isQuizLoading) {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </CardContent>
        </Card>
    );
  }
  
  if (isLocked) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Quiz Verrouillé</CardTitle>
                 <CardDescription>Testez vos connaissances sur ce module.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="relative flex flex-col items-center justify-center p-8 text-center bg-muted/30 rounded-lg">
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 rounded-lg"></div>
                    <div className="relative z-20 flex flex-col items-center">
                        <Lock className="w-12 h-12 text-primary mb-4" />
                        <h3 className="text-xl font-semibold">Quiz Verrouillé</h3>
                        <p className="text-muted-foreground mt-2 max-w-xs">
                            Veuillez cocher la case de confirmation après avoir étudié le contenu du cours pour déverrouiller ce quiz.
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
  }

  if (!quiz && isAdmin && !isStatic) {
    return (
        <Card className="text-center">
            <CardHeader>
                <CardTitle>Aucun quiz trouvé</CardTitle>
                <CardDescription>Ce cours n'a pas encore de quiz. Vous pouvez en créer un dans l'écran de modification.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <ShieldQuestion className="w-12 h-12"/>
                    <p>Cliquez sur "Modifier" en haut de la page pour ajouter un quiz.</p>
                </div>
            </CardContent>
        </Card>
    );
  }

  if (!quiz) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Quiz</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Aucun quiz disponible pour ce cours.</p>
            </CardContent>
        </Card>
    );
  }

  // This is the main view for users who have already passed the quiz.
  if (hasAlreadyPassed && !isAdmin) {
      return (
        <Card>
            <CardHeader>
                <CardTitle>{quiz.title}</CardTitle>
                <CardDescription>Vous avez déjà terminé ce quiz.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center justify-center p-8 text-center bg-green-100/50 dark:bg-green-900/30 rounded-lg">
                    <CheckCircle2 className="w-16 h-16 text-green-600 dark:text-green-500 mb-4" />
                    <h3 className="text-xl font-semibold text-green-800 dark:text-green-300">Félicitations, quiz réussi !</h3>
                    <p className="text-muted-foreground mt-2">
                       Vous pouvez continuer vers le prochain cours.
                    </p>
                </div>
            </CardContent>
             <CardFooter>
                 <Button onClick={handleNextCourse} className="w-full">
                    Cours Suivant
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </CardFooter>
        </Card>
      );
  }


  const handleAnswerChange = (questionIndex: number, answerIndex: number, checked: boolean) => {
    setSelectedAnswers(prev => {
        const currentAnswers = prev[questionIndex] || [];
        if (checked) {
            return { ...prev, [questionIndex]: [...currentAnswers, answerIndex] };
        } else {
            return { ...prev, [questionIndex]: currentAnswers.filter(i => i !== answerIndex) };
        }
    });
  };
  
  const getScore = () => {
      if (!quiz || quiz.questions.length === 0) return 0;
      let correctCount = 0;
      quiz.questions.forEach((_, index) => {
          if (isCorrect(index)) {
              correctCount++;
          }
      });
      return Math.round((correctCount / quiz.questions.length) * 100);
  }

  const handleSubmit = async () => {
    // Critical check to prevent undefined value in arrayUnion
    if (!quizId) {
        toast({
            title: "Erreur",
            description: "ID de quiz non défini. Impossible de sauvegarder le score.",
            variant: "destructive"
        });
        return;
    }

    const score = getScore();
    setFinalScore(score);
    setShowResults(true);
    
    if (!user || !firestore || !quiz) return;
    
    const userRef = doc(firestore, 'users', user.uid);
    
    try {
        await runTransaction(firestore, async (transaction) => {
            const userDoc = await transaction.get(userRef);
            if (!userDoc.exists()) {
                throw "Document does not exist!";
            }
            
            const userData = userDoc.data();
            const oldAverage = userData.averageScore || 0;
            const quizAttempts = (userData.quizAttempts || 0) + 1;
            const newAverage = (oldAverage * (quizAttempts - 1) + score) / quizAttempts;
            
            transaction.update(userRef, { 
                averageScore: newAverage,
                quizAttempts: increment(1)
            });

            // Badge logic
            const quizPassed = score >= 80;
            const alreadyPassed = userData.completedQuizzes?.includes(quizId);

            if (quizPassed && !alreadyPassed) {
                const currentPassedCount = userData.quizzesPassed || 0;
                const newPassedCount = currentPassedCount + 1;

                transaction.update(userRef, {
                    quizzesPassed: newPassedCount,
                    completedQuizzes: arrayUnion(quizId)
                });

                if (newPassedCount > 0 && newPassedCount % 3 === 0) {
                    const earnedBadges = userData.badges || [];
                    // Find the next badge that is not yet earned
                    const nextBadge = allBadges.find(b => !earnedBadges.includes(b.id));

                    if (nextBadge) {
                        transaction.update(userRef, {
                            badges: arrayUnion(nextBadge.id)
                        });

                         setTimeout(() => {
                           toast({
                                title: "Badge débloqué !",
                                description: `Félicitations, vous avez gagné le badge "${nextBadge.name}" !`,
                            });
                         }, 500);
                    }
                }
            }
        });
    } catch (e) {
        console.error("Transaction failed: ", e);
        toast({
            title: "Erreur",
            description: "Impossible de sauvegarder votre score. Veuillez réessayer.",
            variant: "destructive"
        });
    }
  };
  
  const isCorrect = (questionIndex: number) => {
    if (!quiz) return false;
    const userAnswers = (selectedAnswers[questionIndex] || []).sort();
    const correctAnswers = quiz.questions[questionIndex].correctAnswers.sort();
    
    if (userAnswers.length !== correctAnswers.length) {
        return false;
    }
    
    return userAnswers.every((val, index) => val === correctAnswers[index]);
  }

  const getCorrectAnswersText = (question: Question) => {
    return question.correctAnswers.map(i => `"${question.options[i]}"`).join(', ');
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{quiz.title}</CardTitle>
        <CardDescription>Testez vos connaissances sur ce module. Plusieurs réponses peuvent être correctes.</CardDescription>
      </CardHeader>
      
      <>
          <CardContent className="space-y-4">
            {quiz.questions.map((question, qIndex) => (
              <Accordion key={qIndex} type="single" collapsible>
                <AccordionItem value={`item-${qIndex}`}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                       {showResults && (isCorrect(qIndex) 
                           ? <CheckCircle2 className="h-5 w-5 text-green-500" /> 
                           : <ShieldQuestion className="h-5 w-5 text-red-500" />
                       )}
                       <span>Question {qIndex + 1}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <p className="font-medium">{question.text}</p>
                      <div className='space-y-2'>
                        {question.options.map((option, oIndex) => (
                          <div key={oIndex} className="flex items-center space-x-2">
                            <Checkbox 
                                id={`q${qIndex}o${oIndex}`}
                                onCheckedChange={(checked) => handleAnswerChange(qIndex, oIndex, checked as boolean)}
                                disabled={showResults}
                                checked={selectedAnswers[qIndex]?.includes(oIndex) || false}
                            />
                            <Label htmlFor={`q${qIndex}o${oIndex}`}>{option}</Label>
                          </div>
                        ))}
                      </div>
                      {showResults && (
                        <div className={cn("mt-4 p-3 rounded-md text-sm font-semibold", isCorrect(qIndex) ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300')}>
                            {isCorrect(qIndex) ? 'Correct !' : `Incorrect. La ou les bonne(s) réponse(s) était(ent) : ${getCorrectAnswersText(question)}`}
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}
          </CardContent>
          <CardFooter className="flex-col gap-4">
            {!showResults && (
                <Button onClick={handleSubmit} className="w-full" disabled={showResults || quiz.questions.length === 0}>
                    Soumettre le quiz
                </Button>
            )}
            
            {showResults && (
                <div className="text-center w-full space-y-4">
                    {finalScore !== null && (
                        <div className="font-bold text-lg">
                           Votre score : <span className={cn(finalScore >= 80 ? 'text-green-600' : 'text-red-600')}>{finalScore}%</span>
                        </div>
                    )}
                     <Button onClick={handleNextCourse} className="w-full">
                        Cours Suivant
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            )}
          </CardFooter>
        </>
    </Card>
  );
}
