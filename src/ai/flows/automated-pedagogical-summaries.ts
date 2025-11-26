'use server';
/**
 * @fileOverview This file contains the Genkit flow for generating automated pedagogical summaries and highlighting potential non-compliance issues.
 *
 * - generatePedagogicalSummary - A function that takes learning module content and generates a summary, highlighting potential non-compliance issues.
 * - PedagogicalSummaryInput - The input type for the generatePedagogicalSummary function.
 * - PedagogicalSummaryOutput - The return type for the generatePedagogicalSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PedagogicalSummaryInputSchema = z.object({
  moduleContent: z
    .string()
    .describe('The content of the learning module to be summarized.'),
});
export type PedagogicalSummaryInput = z.infer<typeof PedagogicalSummaryInputSchema>;

const PedagogicalSummaryOutputSchema = z.object({
  summary: z.string().describe('A summary of the learning module content.'),
  nonComplianceHighlights: z
    .string()
    .describe(
      'Highlighted potential non-compliance issues found within the learning module content.'
    ),
});
export type PedagogicalSummaryOutput = z.infer<typeof PedagogicalSummaryOutputSchema>;

export async function generatePedagogicalSummary(
  input: PedagogicalSummaryInput
): Promise<PedagogicalSummaryOutput> {
  return pedagogicalSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'pedagogicalSummaryPrompt',
  input: {schema: PedagogicalSummaryInputSchema},
  output: {schema: PedagogicalSummaryOutputSchema},
  prompt: `You are an AI tutor specializing in compliance and regulation.  Your task is to provide a summary of the learning module and highlight any potential non-compliance issues.

Learning Module Content: {{{moduleContent}}}

Summary:
Non-Compliance Issues:
`,
});

const pedagogicalSummaryFlow = ai.defineFlow(
  {
    name: 'pedagogicalSummaryFlow',
    inputSchema: PedagogicalSummaryInputSchema,
    outputSchema: PedagogicalSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
