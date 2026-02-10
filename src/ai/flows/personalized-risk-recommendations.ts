'use server';

/**
 * @fileOverview Provides personalized compliance recommendations based on a learner's risk profile.
 *
 * - personalizedRiskRecommendations - A function that takes a user's risk profile and returns personalized compliance recommendations.
 * - PersonalizedRiskRecommendationsInput - The input type for the personalizedRiskRecommendations function.
 * - PersonalizedRiskRecommendationsOutput - The return type for the personalizedRiskRecommendations function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const RecommendationSchema = z.object({
  courseId: z.string().describe("L'ID unique du cours recommandé."),
  title: z.string().describe('Le titre du cours recommandé.'),
});

const PersonalizedRiskRecommendationsInputSchema = z.object({
  riskProfile: z
    .string()
    .describe(
      "Une description du profil de risque de l'utilisateur. Inclure les formations précédentes, les résultats aux quiz et tout incident de conformité."
    ),
  courses: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
  })).describe('Une liste des cours disponibles parmi lesquels choisir les recommandations.')
});
export type PersonalizedRiskRecommendationsInput = z.infer<
  typeof PersonalizedRiskRecommendationsInputSchema
>;

const PersonalizedRiskRecommendationsOutputSchema = z.object({
  recommendations: z
    .array(RecommendationSchema)
    .describe(
      'Une liste de recommandations de cours personnalisées basées sur le profil de risque de l-utilisateur.'
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
  input: { schema: PersonalizedRiskRecommendationsInputSchema },
  output: { schema: PersonalizedRiskRecommendationsOutputSchema },
  prompt: `Vous êtes un tuteur IA en conformité. Votre rôle est de fournir des recommandations de cours personnalisées pour combler les faiblesses spécifiques d'un apprenant.

Profil de risque de l'apprenant (en français) :
{{riskProfile}}

Catalogue de cours disponibles :
{{#each courses}}
- ID: {{id}}, Titre: {{title}}, Description: {{description}}
{{/each}}

En vous basant **uniquement** sur le catalogue de cours fourni, sélectionnez jusqu'à 3 cours qui répondent le mieux aux besoins de l'apprenant identifiés dans son profil de risque.

Retournez une liste d'objets, où chaque objet contient 'courseId' et 'title' pour chaque cours recommandé. Assurez-vous que le 'courseId' et le 'title' correspondent exactement à ceux du catalogue.
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
    // Return empty recommendations if no courses are available
    if (!input.courses || input.courses.length === 0) {
      return { recommendations: [] };
    }

    try {
      if (!process.env.GROQ_API_KEY) {
        console.error('[AI Flow] GROQ_API_KEY is missing');
        return { recommendations: [] }; // Fallback to empty instead of crashing
      }
      const { output } = await prompt(input);
      if (!output) {
        throw new Error('AI output is null or undefined');
      }
      return output;
    } catch (error: any) {
      console.error('[AI Flow] Error in personalizedRiskRecommendationsFlow:', error);
      // Return empty instead of throwing to avoid 500 on the page if AI fails
      return { recommendations: [] };
    }
  }
);

