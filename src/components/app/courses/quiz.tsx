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
import { Lock, Award, ShieldQuestion, CheckCircle2, ArrowRight, XCircle } from 'lucide-react';
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

  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number[]>>({});
  const [showResults, setShowResults] = useState(false);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [newBadgeEarned, setNewBadgeEarned] = useState(false);
  
  const hasAlreadyPassed = userProfile?.completedQuizzes?.includes(quizId);
  const savedScore = userProfile?.scores?.[quizId];
  
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
    if (hasAlreadyPassed && savedScore !== undefined) {
        setShowResults(true);
        setFinalScore(savedScore);
    } else {
        setShowResults(false);
        setFinalScore(null);
        setSelectedAnswers({});
    }
  }, [hasAlreadyPassed, savedScore, quizId]);

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

  const isAdmin = userProfile?.role === 'admin';
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

  const renderResultHeader = (score: number, newBadge: boolean) => {
    if (score >= 80) {
      return {
        title: newBadge ? "Test réussi avec badge !" : "Test réussi !",
        icon: newBadge ? <Award className="w-8 h-8 text-yellow-500" /> : <CheckCircle2 className="w-8 h-8 text-green-600" />,
        description: `Félicitations ! Votre score est de ${score}%. ${newBadge ? 'Vous avez obtenu un nouveau badge !' : ''}`,
        cardClass: "bg-green-100/50 dark:bg-green-900/30",
        titleClass: "text-green-800 dark:text-green-300"
      };
    }
    return {
      title: "Test échoué",
      icon: <XCircle className="w-8 h-8 text-red-600" />,
      description: `Votre score est de ${score}%. N'hésitez pas à revoir le cours et à retenter votre chance. Les corrections sont ci-dessous.`,
      cardClass: "bg-red-100/50 dark:bg-red-900/30",
      titleClass: "text-red-800 dark:text-red-300"
    };
  };

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
    setNewBadgeEarned(false);
    
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
            
            const updates: Record<string, any> = { 
                averageScore: newAverage,
                quizAttempts: increment(1),
                [`scores.${quizId}`]: score
            };

            // Badge logic
            const quizPassed = score >= 80;
            const alreadyPassed = userData.completedQuizzes?.includes(quizId);

            if (quizPassed && !alreadyPassed) {
                const currentPassedCount = userData.quizzesPassed || 0;
                const newPassedCount = currentPassedCount + 1;
                
                updates.quizzesPassed = newPassedCount;
                updates.completedQuizzes = arrayUnion(quizId);

                if (newPassedCount > 0 && newPassedCount % 3 === 0) {
                    const earnedBadges = userData.badges || [];
                    const nextBadge = allBadges.find(b => !earnedBadges.includes(b.id));

                    if (nextBadge) {
                        updates.badges = arrayUnion(nextBadge.id);

                         setTimeout(() => {
                           toast({
                                title: "Badge débloqué !",
                                description: `Félicitations, vous avez gagné le badge "${nextBadge.name}" !`,
                            });
                            setNewBadgeEarned(true);
                         }, 500);
                    }
                }
            }
            
            transaction.update(userRef, updates);
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
    if (!question.correctAnswers || question.correctAnswers.length === 0) {
        return "Aucune réponse correcte définie.";
    }
    return question.correctAnswers
        .map(index => `"${question.options[index]}"`)
        .join(', ');
  }

  const resultHeader = (showResults && finalScore !== null) ? renderResultHeader(finalScore, newBadgeEarned) : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{quiz.title}</CardTitle>
        {!(showResults || hasAlreadyPassed) && (
            <CardDescription>Testez vos connaissances sur ce module. Plusieurs réponses peuvent être correctes.</CardDescription>
        )}
      </CardHeader>
      
      {resultHeader && (
        <CardContent className={cn("m-6 mb-0 p-4 rounded-lg flex items-center gap-4", resultHeader.cardClass)}>
            {resultHeader.icon}
            <div>
                <h3 className={cn("font-semibold text-lg", resultHeader.titleClass)}>{resultHeader.title}</h3>
                <p className="text-sm text-muted-foreground">{resultHeader.description}</p>
            </div>
        </CardContent>
      )}

      <CardContent className="space-y-4">
        {quiz.questions.map((question, qIndex) => (
          <div key={qIndex} className="border-t pt-4">
            <p className="font-medium flex items-center gap-2 mb-2">
                {(showResults || hasAlreadyPassed) && (isCorrect(qIndex) 
                    ? <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" /> 
                    : <XCircle className="h-5 w-5 text-red-500 shrink-0" />
                )}
                <span>Question {qIndex + 1}: {question.text}</span>
            </p>
            <div className='space-y-2 pl-7'>
                {question.options.map((option, oIndex) => (
                <div key={oIndex} className="flex items-center space-x-2">
                    <Checkbox 
                        id={`q${qIndex}o${oIndex}`}
                        onCheckedChange={(checked) => handleAnswerChange(qIndex, oIndex, checked as boolean)}
                        disabled={showResults || hasAlreadyPassed}
                        checked={selectedAnswers[qIndex]?.includes(oIndex) || false}
                    />
                    <Label htmlFor={`q${qIndex}o${oIndex}`} className="cursor-pointer">{option}</Label>
                </div>
                ))}
            </div>
            {(showResults || hasAlreadyPassed) && !isCorrect(qIndex) && (
                <div className="mt-4 p-3 rounded-md text-sm font-semibold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 ml-7">
                    Incorrect. La ou les bonne(s) réponse(s) était(ent) : {getCorrectAnswersText(question)}
                </div>
            )}
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex-col gap-4">
        {!hasAlreadyPassed && !showResults && (
            <Button onClick={handleSubmit} className="w-full" disabled={showResults || quiz.questions.length === 0}>
                Soumettre le quiz
            </Button>
        )}
        {(hasAlreadyPassed || showResults) && (
              <Button onClick={handleNextCourse} className="w-full">
                Cours Suivant
                <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        )}
      </CardFooter>
    </Card>
  );
}
