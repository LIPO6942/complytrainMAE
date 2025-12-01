'use client';

import { useState } from 'react';
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
import { doc, writeBatch, collection } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { Course, QuizData } from '@/lib/quiz-data';
import { useRouter } from 'next/navigation';

interface EditCourseFormProps {
  course: WithId<Course>;
  quiz: WithId<QuizData> | null;
  isStatic: boolean;
  onFinished: () => void;
}

export function EditCourseForm({ course, quiz, isStatic, onFinished }: EditCourseFormProps) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: course.title,
    description: course.description,
    videoUrl: course.videoUrl || '',
    markdownContent: course.markdownContent || '',
    image: course.image,
    pdfUrl: course.pdfUrl || '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (value: string) => {
    setFormData((prev) => ({ ...prev, image: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore) return;

    try {
        const batch = writeBatch(firestore);

        const courseRef = doc(firestore, 'courses', course.id);
        
        const coursePayload = {
            ...course, // spread existing fields
            ...formData, // overwrite with form data
            id: course.id,
            isStatic: false // No longer static
        };

        batch.set(courseRef, coursePayload, { merge: true });

        // If it was a static course, we might need to copy its quiz over too
        if (isStatic && quiz) {
            const quizId = course.quizId || quiz.id;
            const quizRef = doc(firestore, 'courses', course.id, 'quizzes', quizId);
            const quizPayload = {
                ...quiz,
                id: quizId
            };
            batch.set(quizRef, quizPayload, { merge: true });
        }
        
        await batch.commit();

        toast({
        title: 'Cours mis à jour',
        description: 'Les modifications ont été enregistrées.',
        });

        onFinished();

        if (isStatic) {
            // refresh to reflect new dynamic state
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

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Modifier le cours</CardTitle>
          <CardDescription>
            Apportez des modifications aux détails de ce cours.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre du cours</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">Image du cours</Label>
            <Select value={formData.image} onValueChange={handleImageChange}>
                <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une image" />
                </SelectTrigger>
                <SelectContent>
                    {PlaceHolderImages.map((img) => (
                        <SelectItem key={img.id} value={img.id}>
                            {img.description}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="videoUrl">URL de la vidéo</Label>
            <Input
              id="videoUrl"
              name="videoUrl"
              placeholder="https://.../video.mp4"
              value={formData.videoUrl}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pdfUrl">URL du PDF</Label>
            <Input
              id="pdfUrl"
              name="pdfUrl"
              placeholder="https://.../document.pdf"
              value={formData.pdfUrl}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="markdownContent">Contenu du cours (Markdown)</Label>
            <Textarea
              id="markdownContent"
              name="markdownContent"
              value={formData.markdownContent}
              onChange={handleChange}
              rows={10}
              placeholder="Vous pouvez utiliser la syntaxe Markdown ici..."
            />
          </div>
        </CardContent>
        <CardFooter className="gap-2">
          <Button type="submit">Enregistrer les modifications</Button>
          <Button variant="outline" onClick={onFinished}>
            Annuler
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
