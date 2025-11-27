'use client';
import { useState } from 'react';
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
import { useUser, useFirestore, setDocumentNonBlocking, addDocumentNonBlocking } from '@/firebase';
import { doc, collection, arrayUnion } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { PlusCircle, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import type { QuizData, Question } from '@/lib/quiz-data';


interface QuizProps {
    quiz: QuizData | null;
    isQuizLoading: boolean;
    courseId: string;
    quizId: string;
    isLocked: boolean;
    isStatic?: boolean;
}

function AddQuestionForm({ courseId, quizId, onAdd }: { courseId: string; quizId: string; onAdd: () => void }) {
    const firestore = useFirestore();
    const [questionText, setQuestionText] = useState('');
    const [options, setOptions] = useState(['', '', '']);
    const [correctAnswers, setCorrectAnswers] = useState<number[]>([]);
    const { toast } = useToast();

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };
    
    const handleCorrectAnswerChange = (index: number, checked: boolean) => {
        setCorrectAnswers(prev => {
            if (checked) {
                return [...prev, index];
            } else {
                return prev.filter(i => i !== index);
            }
        });
    };

    const handleAddQuestion = () => {
        if (!firestore) return;
        if (!questionText || options.some(opt => !opt.trim()) || correctAnswers.length === 0) {
            toast({
                title: "Champs incomplets",
                description: "Veuillez remplir la question, toutes les options, et sélectionner au moins une bonne réponse.",
                variant: "destructive"
            });
            return;
        }

        const quizRef = doc(firestore, 'courses', courseId, 'quizzes', quizId);

        const newQuestion = {
            text: questionText,
            options: options,
            correctAnswers: correctAnswers.sort((a, b) => a - b)
        };

        setDocumentNonBlocking(quizRef, {
            questions: arrayUnion(newQuestion)
        }, { merge: true });

        toast({
            title: "Question ajoutée",
            description: "La nouvelle question a été ajoutée au quiz."
        });

        // Reset form
        setQuestionText('');
        setOptions(['', '', '']);
        setCorrectAnswers([]);
        onAdd(); // Close the form
    };

    return (
        <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
            <h4 className="font-semibold">Ajouter une nouvelle question</h4>
            <div className="space-y-2">
                <Label>Texte de la question</Label>
                <input value={questionText} onChange={(e) => setQuestionText(e.target.value)} className="w-full p-2 border rounded-md" />
            </div>
            <div className="space-y-2">
                <Label>Options de réponse</Label>
                {options.map((option, index) => (
                     <div key={index} className="flex items-center gap-2">
                        <input value={option} onChange={(e) => handleOptionChange(index, e.target.value)} className="w-full p-2 border rounded-md" />
                     </div>
                ))}
            </div>
             <div className="space-y-2">
                <Label>Bonnes réponses (choix multiples)</Label>
                 <div className="space-y-2">
                    {options.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2">
                            <Checkbox 
                                id={`correct-opt-${index}`} 
                                onCheckedChange={(checked) => handleCorrectAnswerChange(index, checked as boolean)}
                                checked={correctAnswers.includes(index)}
                            />
                            <Label htmlFor={`correct-opt-${index}`}>Option {index + 1}</Label>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddQuestion}>Enregistrer la question</Button>
              <Button variant="ghost" onClick={onAdd}>Annuler</Button>
            </div>
        </div>
    );
}


export function Quiz({ quiz, isQuizLoading, courseId, quizId, isLocked, isStatic }: QuizProps) {
  const { userProfile } = useUser();
  const firestore = useFirestore();
  const isAdmin = userProfile?.role === 'admin';
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number[]>>({});
  const [showResults, setShowResults] = useState(false);
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  
  const handleCreateQuiz = () => {
    if (!firestore || !courseId || !quizId) return;

    const quizRef = doc(collection(firestore, 'courses', courseId, 'quizzes'), quizId);
    setDocumentNonBlocking(quizRef, {
      id: quizId,
      title: 'Quiz : Blanchiment d\'argent',
      questions: [
        {
          text: 'Laquelle des propositions suivantes est une étape clé de la lutte contre le blanchiment d’argent (LAB) ?',
          options: ['Marketing sur les réseaux sociaux', 'Intégration des employés', 'Déclaration de transaction suspecte (DTS)'],
          correctAnswers: [2]
        }
      ]
    }, { merge: true });
  };

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
  
  if (!quiz && isAdmin && !isStatic) {
    return (
        <Card className="text-center">
            <CardHeader>
                <CardTitle>Aucun quiz trouvé</CardTitle>
                <CardDescription>Ce cours n'a pas encore de quiz.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={handleCreateQuiz}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Créer un quiz de base
                </Button>
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

  const handleSubmit = () => {
    setShowResults(true);
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

  const getScore = () => {
      if (!quiz || quiz.questions.length === 0) return '0';
      let correctCount = 0;
      quiz.questions.forEach((_, index) => {
          if (isCorrect(index)) {
              correctCount++;
          }
      });
      return ((correctCount / quiz.questions.length) * 100).toFixed(0);
  }

  const getCorrectAnswersText = (question: Question) => {
    return question.correctAnswers.map(i => `"${question.options[i]}"`).join(', ');
  }

  return (
    <Card className={cn(isLocked && "bg-muted/50")}>
      <CardHeader>
        <CardTitle>{quiz.title}</CardTitle>
        <CardDescription>Testez vos connaissances sur ce module. Plusieurs réponses peuvent être correctes.</CardDescription>
      </CardHeader>
      <CardContent className={cn("space-y-4", isLocked && "opacity-50 pointer-events-none")}>
        {quiz.questions.map((question, qIndex) => (
          <Accordion key={qIndex} type="single" collapsible disabled={isLocked}>
            <AccordionItem value={`item-${qIndex}`}>
              <AccordionTrigger>Question {qIndex + 1}</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <p className="font-medium">{question.text}</p>
                  <div className='space-y-2'>
                    {question.options.map((option, oIndex) => (
                      <div key={oIndex} className="flex items-center space-x-2">
                        <Checkbox 
                            id={`q${qIndex}o${oIndex}`}
                            onCheckedChange={(checked) => handleAnswerChange(qIndex, oIndex, checked as boolean)}
                            disabled={showResults || isLocked}
                        />
                        <Label htmlFor={`q${qIndex}o${oIndex}`}>{option}</Label>
                      </div>
                    ))}
                  </div>
                   {showResults && (
                      <div className={cn("mt-2 text-sm font-semibold", isCorrect(qIndex) ? 'text-green-600' : 'text-red-600')}>
                          {isCorrect(qIndex) ? 'Correct !' : `Incorrect. La ou les bonne(s) réponse(s) était(ent) : ${getCorrectAnswersText(question)}`}
                      </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}

        {isAdmin && !isStatic && (
            showAddQuestion ? (
                <AddQuestionForm courseId={courseId} quizId={quizId} onAdd={() => setShowAddQuestion(false)} />
            ) : (
                <Button variant="outline" className="w-full mt-4" onClick={() => setShowAddQuestion(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Ajouter une question
                </Button>
            )
        )}
      </CardContent>
      <CardFooter className="flex-col gap-4">
        {isLocked ? (
            <div className="flex items-center justify-center text-sm text-muted-foreground p-4 text-center">
                <Lock className="mr-2 h-4 w-4" />
                Veuillez confirmer la lecture du contenu pour débloquer le quiz.
            </div>
        ) : (
             <Button onClick={handleSubmit} className="w-full" disabled={showResults}>
                Soumettre le quiz
            </Button>
        )}
        
        {showResults && !isLocked && (
            <div className="text-center font-bold text-lg">
                Votre score : {getScore()}%
            </div>
        )}
      </CardFooter>
    </Card>
  );
}
