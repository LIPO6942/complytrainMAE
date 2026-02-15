import { genkit } from 'genkit';
import { groq } from 'genkitx-groq';

// Helper to safely initialize Genkit
const initializeGenkit = () => {
  try {
    if (!process.env.GROQ_API_KEY) {
      console.warn("GROQ_API_KEY is missing. AI features will be disabled.");
      // Return a dummy object or throw? Genkit doesn't have a "dummy" mode easily.
      // We will let it initialize but without plugins/model if key is missing, hoping it doesn't crash immediately.
      // Actually, groq() plugin might crash if key is missing depending on implementation.
      // Let's create a proxy that throws on usage instead of on init.
      return {
        defineFlow: (...args: any[]) => ((...input: any[]) => { throw new Error("AI disabled: Missing API Key"); }),
        definePrompt: (...args: any[]) => ((...input: any[]) => { throw new Error("AI disabled: Missing API Key"); }),
        generate: (...args: any[]) => { throw new Error("AI disabled: Missing API Key"); },
      } as any;
    }

    return genkit({
      plugins: [
        groq()
      ],
      model: 'groq/llama-3.3-70b-versatile',
    });
  } catch (error) {
    console.error("Failed to initialize Genkit:", error);
    // Return a dummy safeguard
    return {
      defineFlow: () => (() => Promise.resolve({ recommendations: [] })),
      definePrompt: () => (() => Promise.resolve({ output: null })),
    } as any;
  }
};

export const ai = initializeGenkit();
