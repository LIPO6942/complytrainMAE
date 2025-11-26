'use server';

import { aiComplianceTutor } from '@/ai/flows/ai-compliance-tutor';
import { z } from 'zod';

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
