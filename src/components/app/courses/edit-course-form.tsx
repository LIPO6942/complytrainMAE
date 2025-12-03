
'use client';
import { useState, useId } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useFirestore, type WithId } from '@/firebase';
import { doc, writeBatch } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import type { Course, QuizData, Question } from '@/lib/quiz-data';
import { useRouter } from 'next/navigation';
import { Trash2, PlusCircle } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface EditCourseFormProps {
  course: WithId<Course>;
  quiz: WithId<QuizData> | null;
  isStatic: boolean;
  onFinished: () => void;
}

export const courseCategories = [
    "LAB/FT",
    "KYC",
    "RGPD",
    "Fraude",
    "Sanctions Internationales",
    "Conformité Assurance",
    "Quiz Thématique",
    "QCM (réponse multiple)"
];

const quizTypes = [
    "QCM (réponse multiple)",
    "Quiz",
    "Vrai / Faux",
    "Classement (Ranking)"
]

export function EditCourseForm({ course, quiz, isStatic, onFinished }: EditCourseFormProps) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    title: course.title,
    description: course.description,
    category: course.category,
    videoUrl: course.videoUrl || '',
    markdownContent: course.markdownContent || '',
    image: course.image || '',
    pdfUrl: course.pdfUrl || '',
  });

  const [quizData, setQuizData] = useState<QuizData | null>(
    quiz ? { ...quiz } : null
  );

  const [quizType, setQuizType] = useState(quiz?.type || 'Quiz');

  const handleCourseChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
      setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleQuizTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!quizData) return;
    setQuizData({ ...quizData, title: e.target.value });
  };

  const handleQuestionChange = (qIndex: number, text: string) => {
    if (!quizData) return;
    const newQuestions = [...quizData.questions];
    newQuestions[qIndex].text = text;
    setQuizData({ ...quizData, questions: newQuestions });
  };
  
  const handleOptionChange = (qIndex: number, oIndex: number, text: string) => {
    if (!quizData) return;
    const newQuestions = [...quizData.questions];
    newQuestions[qIndex].options[oIndex] = text;
    setQuizData({ ...quizData, questions: newQuestions });
  };
  
  const handleCorrectAnswerChange = (qIndex: number, oIndex: number, checked: boolean) => {
    if (!quizData) return;
    const newQuestions = [...quizData.questions];
    let correctAnswers = newQuestions[qIndex].correctAnswers || [];

    if (checked) {
      if (!correctAnswers.includes(oIndex)) {
        correctAnswers.push(oIndex);
      }
    } else {
      correctAnswers = correctAnswers.filter(ans => ans !== oIndex);
    }
    newQuestions[qIndex].correctAnswers = correctAnswers.sort((a,b) => a - b);
    setQuizData({ ...quizData, questions: newQuestions });
  };

  const addQuestion = () => {
    if (!quizData) return;
    const newQuestion: Question = {
        text: "Nouvelle question",
        options: ["Option A", "Option B", "Option C"],
        correctAnswers: [0]
    };
    setQuizData({ ...quizData, questions: [...quizData.questions, newQuestion] });
  };

  const removeQuestion = (qIndex: number) => {
    if (!quizData) return;
    const newQuestions = quizData.questions.filter((_, index) => index !== qIndex);
    setQuizData({ ...quizData, questions: newQuestions });
  };

  const addOption = (qIndex: number) => {
      if (!quizData) return;
      const newQuestions = [...quizData.questions];
      newQuestions[qIndex].options.push("Nouvelle option");
      setQuizData({ ...quizData, questions: newQuestions });
  };

  const removeOption = (qIndex: number, oIndex: number) => {
      if (!quizData) return;
      const newQuestions = [...quizData.questions];
      newQuestions[qIndex].options = newQuestions[qIndex].options.filter((_, index) => index !== oIndex);
      // Also remove from correct answers if it was one
      newQuestions[qIndex].correctAnswers = (newQuestions[qIndex].correctAnswers || []).filter(ans => ans !== oIndex);
      setQuizData({ ...quizData, questions: newQuestions });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore) return;

    try {
        const batch = writeBatch(firestore);

        const courseRef = doc(firestore, 'courses', course.id);
        const coursePayload: Course = {
            ...course,
            ...formData,
            id: course.id,
            quizId: quiz?.id || course.quizId,
            isStatic: false, 
        };
        delete coursePayload.quiz;
        batch.set(courseRef, coursePayload, { merge: true });

        if (quizData) {
            const quizId = course.quizId || quiz?.id;
            if (!quizId) throw new Error("ID de quiz manquant");

            const quizRef = doc(firestore, 'courses', course.id, 'quizzes', quizId);
            batch.set(quizRef, {...quizData, type: quizType}, { merge: true });
        }
        
        await batch.commit();

        toast({
            title: 'Cours mis à jour',
            description: 'Les modifications ont été enregistrées avec succès.',
        });

        onFinished();

        if (isStatic) {
            router.refresh(); 
        }

    } catch (error) {
        console.error("Error updating course:", error);
        toast({
            title: 'Erreur',
            description: "Une erreur s'est produite lors de la mise à jour.",
            variant: "destructive"
        });
    }
  };
  
  const formId = useId();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Modifier le contenu du cours</CardTitle>
          <CardDescription>
            Apportez des modifications aux détails de ce cours.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Form fields for course content */}
          <div className="space-y-2">
            <Label htmlFor="title">Titre du cours</Label>
            <Input id="title" name="title" value={formData.title} onChange={handleCourseChange} />
          </div>
           <div className="space-y-2">
            <Label htmlFor="category">Catégorie</Label>
            <Select value={formData.category} onValueChange={(value) => handleSelectChange('category', value)}>
                <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                    {courseCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                            {cat}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">URL de l'image</Label>
            <Input id="image" name="image" value={formData.image} onChange={handleCourseChange} placeholder="https://.../image.png" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" value={formData.description} onChange={handleCourseChange} rows={3} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="videoUrl">URL de la vidéo</Label>
            <Input id="videoUrl" name="videoUrl" placeholder="https://.../video.mp4" value={formData.videoUrl} onChange={handleCourseChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pdfUrl">URL du PDF</Label>
            <Input id="pdfUrl" name="pdfUrl" placeholder="https://.../document.pdf" value={formData.pdfUrl} onChange={handleCourseChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="markdownContent">Contenu du cours (Markdown)</Label>
            <Textarea id="markdownContent" name="markdownContent" value={formData.markdownContent} onChange={handleCourseChange} rows={10} placeholder="Vous pouvez utiliser la syntaxe Markdown ici..." />
          </div>
        </CardContent>
      </Card>

      {quizData && (
        <Card>
            <CardHeader>
                <CardTitle>Modifier le Quiz</CardTitle>
                <CardDescription>Modifiez les questions, les options et les réponses correctes pour ce quiz.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                 <div className="space-y-2">
                    <Label htmlFor="quizType">Type de test</Label>
                    <Select value={quizType} onValueChange={setQuizType}>
                        <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un type de test" />
                        </SelectTrigger>
                        <SelectContent>
                            {quizTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                    {type}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                 </div>
                <div className="space-y-2">
                    <Label htmlFor="quizTitle">Titre du Quiz</Label>
                    <Input id="quizTitle" value={quizData.title} onChange={handleQuizTitleChange} />
                </div>
                {quizData.questions.map((question, qIndex) => (
                    <div key={`${formId}-q-${qIndex}`} className="space-y-4 border p-4 rounded-lg bg-muted/20 relative">
                        <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => removeQuestion(qIndex)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>

                        <div className="space-y-2">
                            <Label htmlFor={`q-text-${qIndex}`}>Question {qIndex + 1}</Label>
                            <Textarea id={`q-text-${qIndex}`} value={question.text} onChange={(e) => handleQuestionChange(qIndex, e.target.value)} />
                        </div>
                        
                        <div className="space-y-2">
                            <Label>Options et Réponses Correctes</Label>
                            {question.options.map((option, oIndex) => (
                                <div key={`${formId}-q-${qIndex}-o-${oIndex}`} className="flex items-center gap-2">
                                    <Checkbox 
                                        id={`q-${qIndex}-correct-${oIndex}`}
                                        checked={(question.correctAnswers || []).includes(oIndex)}
                                        onCheckedChange={(checked) => handleCorrectAnswerChange(qIndex, oIndex, checked as boolean)}
                                    />
                                    <Input 
                                        value={option}
                                        onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                        className="flex-grow"
                                    />
                                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => removeOption(qIndex, oIndex)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                             <Button type="button" variant="outline" size="sm" onClick={() => addOption(qIndex)}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Ajouter une option
                            </Button>
                        </div>
                    </div>
                ))}

                <Button type="button" variant="secondary" className="w-full" onClick={addQuestion}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Ajouter une question au Quiz
                </Button>
            </CardContent>
        </Card>
      )}

       <Card>
            <CardFooter className="gap-2 justify-end p-6">
                <Button type="button" variant="outline" onClick={onFinished}>
                    Annuler
                </Button>
                <Button type="submit">Enregistrer Toutes les Modifications</Button>
            </CardFooter>
      </Card>
    </form>
  );
}

    
