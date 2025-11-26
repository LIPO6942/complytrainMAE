'use server';
/**
 * @fileOverview AI-powered compliance tutor for learners.
 *
 * - aiComplianceTutor - A function that provides AI tutoring on compliance topics.
 * - AiComplianceTutorInput - The input type for the aiComplianceTutor function.
 * - AiComplianceTutorOutput - The return type for the aiComplianceTutor function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiComplianceTutorInputSchema = z.object({
  question: z.string().describe('The compliance question from the learner.'),
});
export type AiComplianceTutorInput = z.infer<typeof AiComplianceTutorInputSchema>;

const AiComplianceTutorOutputSchema = z.object({
  answer: z.string().describe('The AI tutor answer to the compliance question.'),
});
export type AiComplianceTutorOutput = z.infer<typeof AiComplianceTutorOutputSchema>;

export async function aiComplianceTutor(input: AiComplianceTutorInput): Promise<AiComplianceTutorOutput> {
  return aiComplianceTutorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiComplianceTutorPrompt',
  input: {schema: AiComplianceTutorInputSchema},
  output: {schema: AiComplianceTutorOutputSchema},
  prompt: `You are an AI compliance tutor providing answers to learners questions within strict regulatory guidelines.

  Learner Question: {{{question}}}
  `,
});

const aiComplianceTutorFlow = ai.defineFlow(
  {
    name: 'aiComplianceTutorFlow',
    inputSchema: AiComplianceTutorInputSchema,
    outputSchema: AiComplianceTutorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
