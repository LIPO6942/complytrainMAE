'use server';

/**
 * @fileOverview Provides personalized compliance recommendations based on a learner's risk profile.
 *
 * - personalizedRiskRecommendations - A function that takes a user's risk profile and returns personalized compliance recommendations.
 * - PersonalizedRiskRecommendationsInput - The input type for the personalizedRiskRecommendations function.
 * - PersonalizedRiskRecommendationsOutput - The return type for the personalizedRiskRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedRiskRecommendationsInputSchema = z.object({
  riskProfile: z
    .string()
    .describe(
      'A description of the user risk profile. Include previous training, quiz results, and any compliance incidents.'
    ),
});
export type PersonalizedRiskRecommendationsInput = z.infer<
  typeof PersonalizedRiskRecommendationsInputSchema
>;

const PersonalizedRiskRecommendationsOutputSchema = z.object({
  recommendations: z
    .string()
    .describe(
      'A list of personalized compliance recommendations based on the user risk profile.'
    ),
});
export type PersonalizedRiskRecommendationsOutput = z.infer<
  typeof PersonalizedRiskRecommendationsOutputSchema
>;

export async function personalizedRiskRecommendations(
  input: PersonalizedRiskRecommendationsInput
): Promise<PersonalizedRiskRecommendationsOutput> {
  return personalizedRiskRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedRiskRecommendationsPrompt',
  input: {schema: PersonalizedRiskRecommendationsInputSchema},
  output: {schema: PersonalizedRiskRecommendationsOutputSchema},
  prompt: `You are an AI compliance tutor. A learner has the following risk profile:

  {{riskProfile}}

  Provide personalized compliance recommendations to address their specific weaknesses.
  Format the recommendations as a numbered list.
  Do not include introductory or concluding remarks; only provide the list.
  Be brief, listing only the titles of courses or modules to review; don't be conversational.
  Focus specifically on compliance and regulatory requirements.
  Ensure that the course titles you recommend cover topics mentioned in the risk profile.
`,
});

const personalizedRiskRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedRiskRecommendationsFlow',
    inputSchema: PersonalizedRiskRecommendationsInputSchema,
    outputSchema: PersonalizedRiskRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
