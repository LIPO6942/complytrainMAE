'use client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useFirestore, deleteDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface DeleteCourseDialogProps {
  courseId: string;
  isStatic?: boolean;
  onDeleted?: (courseId: string) => void;
  trigger?: React.ReactNode;
}

export function DeleteCourseDialog({ courseId, isStatic, onDeleted, trigger }: DeleteCourseDialogProps) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  const handleDelete = () => {
    if (onDeleted) {
      onDeleted(courseId);
    }
    
    if (isStatic) {
        toast({
            title: 'Cours masqué',
            description: 'Le cours statique a été masqué de la vue.',
        });
        if (!onDeleted) {
             router.push('/courses');
        }
        return;
    }

    if (!firestore) return;

    const courseRef = doc(firestore, 'courses', courseId);
    deleteDocumentNonBlocking(courseRef);

    toast({
      title: 'Cours supprimé',
      description: 'Le cours a été supprimé avec succès.',
    });
    
    if (!onDeleted) {
        router.push('/courses');
    }
  };

  const dialogTrigger = trigger ? trigger : (
    <Button variant="destructive">
      <Trash2 className="mr-2 h-4 w-4" />
      Supprimer
    </Button>
  );

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {dialogTrigger}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce cours ?</AlertDialogTitle>
          <AlertDialogDescription>
            {isStatic 
                ? "Cette action masquera ce cours statique de la liste. Il réapparaîtra au prochain rechargement de la page."
                : "Cette action est irréversible. Le cours sera définitivement supprimé de la base de données."
            }
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
            {isStatic ? "Masquer" : "Supprimer"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
