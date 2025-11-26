'use server';

import { aiComplianceTutor } from '@/ai/flows/ai-compliance-tutor';
import { z } from 'zod';

const AskAIComplianceTutorSchema = z.object({
  question: z.string().min(5, 'Question must be at least 5 characters long.'),
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
      message: 'Validation failed. Please check your input.',
    };
  }
  
  try {
    const result = await aiComplianceTutor({ question: validatedFields.data.question });
    return { answer: result.answer, message: "Success" };
  } catch (error) {
    return { message: 'An error occurred while fetching the answer.' };
  }
}
