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
  prompt: `Vous êtes un tuteur IA en conformité. Un apprenant a le profil de risque suivant (en français) :

  {{riskProfile}}

  Fournissez des recommandations de conformité personnalisées pour combler leurs faiblesses spécifiques.
  Formatez les recommandations sous forme de liste à puces (utilisez un tiret '-' pour chaque élément).
  N'incluez pas de remarques introductives ou de conclusion ; fournissez uniquement la liste.
  Soyez bref, en ne listant que les titres des cours ou des modules à réviser ; ne soyez pas conversationnel.
  Concentrez-vous spécifiquement sur les exigences de conformité et réglementaires.
  Assurez-vous que les titres de cours que vous recommandez couvrent les sujets mentionnés dans le profil de risque.
  La réponse doit être en français.
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
