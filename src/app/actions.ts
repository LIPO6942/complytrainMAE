'use server';

import { aiComplianceTutor } from '@/ai/flows/ai-compliance-tutor';
import { z } from 'zod';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInAnonymously as firebaseSignInAnonymously } from 'firebase/auth';
import { auth } from '@/firebase/config-server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

const AskAIComplianceTutorSchema = z.object({
  question: z.string().min(5, 'La question doit comporter au moins 5 caractères.'),
});

type State = {
  message?: string | null;
  errors?: {
    question?: string[];
  } | null,
  answer?: string | null;
};


export async function askAIComplianceTutor(prevState: State, formData: FormData): Promise<State> {
  const validatedFields = AskAIComplianceTutorSchema.safeParse({
    question: formData.get('question'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'La validation a échoué. Veuillez vérifier votre saisie.',
    };
  }
  
  try {
    const result = await aiComplianceTutor({ question: validatedFields.data.question });
    return { answer: result.answer, message: "Succès" };
  } catch (error) {
    return { message: 'Une erreur s\'est produite lors de la récupération de la réponse.' };
  }
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signInWithEmailAndPassword(auth, formData.get('email') as string, formData.get('password') as string);
    revalidatePath('/');
    redirect('/');
  } catch (error: any) {
    if (error.code) {
        switch (error.code) {
            case 'auth/user-not-found':
                return 'Utilisateur non trouvé. Veuillez vérifier votre email.';
            case 'auth/wrong-password':
                return 'Mot de passe incorrect. Veuillez réessayer.';
            case 'auth/invalid-email':
                return 'Email invalide. Veuillez vérifier votre saisie.';
            default:
                return "Une erreur inattendue s'est produite.";
        }
    }
    return "Une erreur inattendue s'est produite.";
  }
}

export async function signUp(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await createUserWithEmailAndPassword(auth, formData.get('email') as string, formData.get('password') as string);
    revalidatePath('/');
    redirect('/');
  } catch (error: any) {
    if (error.code) {
        switch (error.code) {
            case 'auth/email-already-in-use':
                return 'Cet email est déjà utilisé.';
            case 'auth/weak-password':
                return 'Le mot de passe doit comporter au moins 6 caractères.';
            case 'auth/invalid-email':
                return 'Email invalide. Veuillez vérifier votre saisie.';
            default:
                return "Une erreur inattendue s'est produite.";
        }
    }
    return "Une erreur inattendue s'est produite.";
  }
}

export async function signInAnonymously() {
    try {
        await firebaseSignInAnonymously(auth);
        revalidatePath('/');
        redirect('/');
    } catch (error) {
        console.error("Anonymous sign in failed", error);
    }
}
