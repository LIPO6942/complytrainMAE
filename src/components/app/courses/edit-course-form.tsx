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
import { useFirestore, setDocumentNonBlocking, type WithId } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type Course = {
  title: string;
  description: string;
  videoUrl?: string;
  markdownContent?: string;
  image: string;
};

interface EditCourseFormProps {
  course: WithId<Course>;
  onFinished: () => void;
}

export function EditCourseForm({ course, onFinished }: EditCourseFormProps) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: course.title,
    description: course.description,
    videoUrl: course.videoUrl || '',
    markdownContent: course.markdownContent || '',
    image: course.image,
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore) return;

    const courseRef = doc(firestore, 'courses', course.id);
    
    setDocumentNonBlocking(courseRef, formData, { merge: true });
    
    toast({
      title: 'Cours mis à jour',
      description: 'Les modifications ont été enregistrées.',
    });

    onFinished();
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
