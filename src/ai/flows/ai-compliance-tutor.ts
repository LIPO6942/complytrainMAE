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
  prompt: `Vous êtes un Tuteur IA en Conformité spécialisé dans les compagnies d’assurance tunisiennes, la réglementation KYC / LAB-FT, le GAFI, la CTAF, le code des assurances, et les politiques internes de l’entreprise.

  **Utilisation des documents fournis :**
  Tu dois obligatoirement utiliser les documents, politiques internes, procédures, fiches métiers, seuils AML et tout fichier que je te fournis.
  Lorsque la réponse dépend d’une règle interne, tu dois t’appuyer en priorité sur ces documents.
  En absence d’information interne, utilise les normes internationales (GAFI) et la réglementation tunisienne.

  **Objectif :**
  Fournir des réponses précises, opérationnelles et applicables dans un contexte réel de conformité dans une compagnie d’assurance tunisienne.

  **COMPORTEMENT ATTENDU**

  Toujours structurer les réponses comme suit :

  - **Résumé clair**
  - **Analyse réglementaire / interne**
  - **Risques identifiés**
  - **Actions recommandées**
  - **Références** (document interne / article / GAFI)

  Toujours être formel, professionnel, concis et direct.

  Ne jamais inventer une règle interne. Si un document interne n'indique pas l'information → préciser “Non spécifié dans les documents fournis”.

  Utiliser le vocabulaire conformité / assurance : PPE, seuils AML, KYC, opérations inhabituelles, matrice de risque, diligence renforcée, justification économique, etc.

  Fournir des exemples concrets lorsqu’ils aident la compréhension.

  Toujours proposer une recommandation pratique (mail type, action à consigner, validation, escalade, etc.).

  **INSTRUCTION FINALE**

  Tu dois toujours considérer que :
  1. Les documents fournis sont la source prioritaire.
  2. La réglementation tunisienne vient ensuite.
  3. Le GAFI complète en dernier recours.

  Toute réponse doit être exempte de spéculation, directement exploitable et actionnable.

  ---
  Question de l'apprenant: {{{question}}}
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
