'use server';

// import { aiComplianceTutor } from '@/ai/flows/ai-compliance-tutor';
// import { personalizedRiskRecommendations, type PersonalizedRiskRecommendationsInput } from '@/ai/flows/personalized-risk-recommendations';
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

  // AI DISABLED TEMPORARILY
  return { answer: "L'assistant IA est temporairement indisponible.", message: "Succès" };

  /*
  try {
    const result = await aiComplianceTutor({ question: validatedFields.data.question });
    return { answer: result.answer, message: "Succès" };
  } catch (error) {
    return { message: 'Une erreur s\'est produite lors de la récupération de la réponse.' };
  }
  */
}

// --- Personalized Risk Recommendations ---
// export type { PersonalizedRiskRecommendationsInput };
export type PersonalizedRiskRecommendationsInput = {
  riskProfile: string;
  courses: { id: string; title: string; description: string }[];
};

export type PersonalizedRiskRecommendationsResult = {
  recommendations: { courseId: string; title: string }[];
};

export async function getPersonalizedRecommendations(
  input: PersonalizedRiskRecommendationsInput
): Promise<PersonalizedRiskRecommendationsResult> {
  // AI DISABLED TEMPORARILY
  return { recommendations: [] };

  /*
try {
  const result = await personalizedRiskRecommendations(input);
  return result ?? { recommendations: [] };
} catch (error) {
  console.error('[Server Action] Error getting personalized recommendations:', error);
  return { recommendations: [] };
}
  */
}
