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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useUser, useFirestore, setDocumentNonBlocking, addDocumentNonBlocking } from '@/firebase';
import { doc, collection, arrayUnion } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';


type Question = {
  text: string;
  options: string[];
  correctAnswer: number;
};

type QuizData = {
  title: string;
  questions: Question[];
} | null;

interface QuizProps {
    quiz: QuizData;
    isQuizLoading: boolean;
    courseId: string;
    quizId: string;
}

function AddQuestionForm({ courseId, quizId, onAdd }: { courseId: string; quizId: string; onAdd: () => void }) {
    const firestore = useFirestore();
    const [questionText, setQuestionText] = useState('');
    const [options, setOptions] = useState(['', '', '']);
    const [correctAnswer, setCorrectAnswer] = useState(0);
    const { toast } = useToast();

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const handleAddQuestion = () => {
        if (!questionText || options.some(opt => !opt)) {
            toast({
                title: "Champs incomplets",
                description: "Veuillez remplir la question et toutes les options.",
                variant: "destructive"
            });
            return;
        }

        const quizRef = doc(firestore, 'courses', courseId, 'quizzes', quizId);

        const newQuestion = {
            text: questionText,
            options: options,
            correctAnswer: correctAnswer
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
        setCorrectAnswer(0);
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
                <Label>Bonne réponse</Label>
                 <RadioGroup onValueChange={(val) => setCorrectAnswer(Number(val))} defaultValue={String(correctAnswer)}>
                    {options.map((_, index) => (
                        <div key={index} className="flex items-center space-x-2">
                            <RadioGroupItem value={String(index)} id={`r${index}`} />
                            <Label htmlFor={`r${index}`}>Option {index + 1}</Label>
                        </div>
                    ))}
                </RadioGroup>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddQuestion}>Enregistrer la question</Button>
              <Button variant="ghost" onClick={onAdd}>Annuler</Button>
            </div>
        </div>
    );
}


export function Quiz({ quiz, isQuizLoading, courseId, quizId }: QuizProps) {
  const { userProfile } = useUser();
  const firestore = useFirestore();
  const isAdmin = userProfile?.role === 'admin';
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  
  const handleCreateQuiz = () => {
    if (!firestore || !courseId || !quizId) return;

    const quizRef = doc(collection(firestore, 'courses', courseId, 'quizzes'), quizId);
    setDocumentNonBlocking(quizRef, {
      title: 'Quiz : Blanchiment d\'argent',
      questions: [
        {
          text: 'Laquelle des propositions suivantes est une étape clé de la lutte contre le blanchiment d’argent (LCB) ?',
          options: ['Marketing sur les réseaux sociaux', 'Intégration des employés', 'Déclaration de transaction suspecte (DTS)'],
          correctAnswer: 2
        }
      ]
    });
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
  
  if (!quiz && isAdmin) {
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

  const handleAnswerChange = (questionIndex: number, answerIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex,
    }));
  };

  const handleSubmit = () => {
    setShowResults(true);
  };
  
  const getScore = () => {
      let correctCount = 0;
      quiz.questions.forEach((q, index) => {
          if (selectedAnswers[index] === q.correctAnswer) {
              correctCount++;
          }
      });
      return ((correctCount / quiz.questions.length) * 100).toFixed(0);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{quiz.title}</CardTitle>
        <CardDescription>Testez vos connaissances sur ce module.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {quiz.questions.map((question, qIndex) => (
          <Accordion key={qIndex} type="single" collapsible>
            <AccordionItem value={`item-${qIndex}`}>
              <AccordionTrigger>Question {qIndex + 1}</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <p className="font-medium">{question.text}</p>
                  <RadioGroup
                     onValueChange={(val) => handleAnswerChange(qIndex, Number(val))}
                     disabled={showResults}
                  >
                    {question.options.map((option, oIndex) => (
                      <div key={oIndex} className="flex items-center space-x-2">
                        <RadioGroupItem value={String(oIndex)} id={`q${qIndex}o${oIndex}`} />
                        <Label htmlFor={`q${qIndex}o${oIndex}`}>{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                   {showResults && (
                      <div className={`mt-2 text-sm font-semibold ${selectedAnswers[qIndex] === question.correctAnswer ? 'text-green-600' : 'text-red-600'}`}>
                          {selectedAnswers[qIndex] === question.correctAnswer ? 'Correct !' : `Incorrect. La bonne réponse est : ${question.options[question.correctAnswer]}`}
                      </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}

        {isAdmin && (
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
        <Button onClick={handleSubmit} className="w-full" disabled={showResults}>
            Soumettre le quiz
        </Button>
        {showResults && (
            <div className="text-center font-bold text-lg">
                Votre score : {getScore()}%
            </div>
        )}
      </CardFooter>
    </Card>
  );
}
