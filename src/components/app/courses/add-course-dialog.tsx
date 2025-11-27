'use client';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase';
import { collection, writeBatch, doc } from 'firebase/firestore';
import { PlusCircle } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const courseCategories = [
    "LCB / FT",
    "KYC",
    "Fraude",
    "RGPD",
    "Sanctions Internationales",
    "Conformité Assurance",
    "Quiz Thématique"
];

export function AddCourseDialog() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const [open, setOpen] = useState(false);
  
  const [formData, setFormData] = useState({
      title: 'Nouveau Quiz Thématique',
      description: 'Un nouveau quiz thématique prêt à être configuré.',
      category: 'Quiz Thématique',
      image: 'course-new',
      quizTitle: 'Quiz sur le blanchiment d\'argent',
      quizQuestionText: 'Laquelle des propositions suivantes est une étape clé de la lutte contre le blanchiment d’argent (LCB) ?'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
      setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddCourse = async () => {
    if (!firestore) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Le service Firestore n\'est pas disponible.',
      });
      return;
    }
    
    try {
        const newCourseDocRef = doc(collection(firestore, 'courses'));
        const newQuizDocRef = doc(collection(firestore, 'courses', newCourseDocRef.id, 'quizzes'));

        const batch = writeBatch(firestore);

        batch.set(newCourseDocRef, {
            id: newCourseDocRef.id,
            title: formData.title,
            description: formData.description,
            category: formData.category,
            image: formData.image,
            quizId: newQuizDocRef.id,
            videoUrl: '',
            pdfUrl: '',
            markdownContent: '',
        });

        batch.set(newQuizDocRef, {
             id: newQuizDocRef.id,
             title: formData.quizTitle,
             questions: [{
                 text: formData.quizQuestionText,
                 options: ['Marketing sur les réseaux sociaux', 'Intégration des employés', 'Déclaration de transaction suspecte (DTS)'],
                 correctAnswers: [2]
             }]
        });

        await batch.commit();

        toast({
          title: 'Cours ajouté',
          description: `Le cours "${formData.title}" a été créé avec son quiz.`,
        });

        // Reset form and close dialog
        setFormData({
            title: 'Nouveau Quiz Thématique',
            description: 'Un nouveau quiz thématique prêt à être configuré.',
            category: 'Quiz Thématique',
            image: 'course-new',
            quizTitle: 'Quiz sur le blanchiment d\'argent',
            quizQuestionText: 'Laquelle des propositions suivantes est une étape clé de la lutte contre le blanchiment d’argent (LCB) ?'
        });
        setOpen(false);

    } catch (error) {
         console.error("Error creating course and quiz:", error);
         toast({
            variant: "destructive",
            title: "Erreur lors de la création",
            description: "Une erreur s'est produite. Veuillez réessayer."
         });
    }

  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Ajouter un cours
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau cours</DialogTitle>
          <DialogDescription>
            Remplissez les détails ci-dessous pour créer un nouveau cours et son quiz initial.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre du cours</Label>
            <Input id="title" name="title" value={formData.title} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description du cours</Label>
            <Textarea id="description" name="description" value={formData.description} onChange={handleChange} />
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
            <Label htmlFor="image">Image du cours</Label>
            <Select value={formData.image} onValueChange={(value) => handleSelectChange('image', value)}>
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
          <hr className="my-4" />
          <h3 className="font-semibold text-lg">Quiz Initial</h3>
           <div className="space-y-2">
            <Label htmlFor="quizTitle">Titre du Quiz</Label>
            <Input id="quizTitle" name="quizTitle" value={formData.quizTitle} onChange={handleChange} />
          </div>
           <div className="space-y-2">
            <Label htmlFor="quizQuestionText">Première Question</Label>
            <Textarea id="quizQuestionText" name="quizQuestionText" value={formData.quizQuestionText} onChange={handleChange} />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Annuler</Button>
          </DialogClose>
          <Button onClick={handleAddCourse}>Créer le cours</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

    