import { callGemini } from "../services/callGemini";
import { callOpenAI } from "../services/callOpenAI";

export async function aiSdrAgent(input: unknown, setSteps?: (steps: unknown) => void) {
  const name = input.name || "there";
  const company = input.company || "a company";

  setSteps?.([{ step: "Researching company with Gemini..." }]);
  const geminiContext = await callGemini(
    `Find potential pain points or selling angles for a B2B cold email outreach targeting ${company}.`
  );

  setSteps?.(prev => [...prev, { step: "Writing cold email sequence using OpenAI..." }]);
  const emailSequence = await callOpenAI(`
You are an expert SDR. Using the following context about ${company}, write a 3-step B2B cold email sequence targeting ${name}.
Context: ${geminiContext}
Structure:
1. First-touch email (value-driven)
2. Follow-up email (add new angle)
3. Final bump/check-in
Return as JSON:
{
  "first_email": "...",
  "follow_up": "...",
  "final_bump": "..."
}
  `);

  try {
    const parsed = JSON.parse(emailSequence);
    return parsed;
  } catch {
    return { first_email: emailSequence, follow_up: "", final_bump: "" };
  }
}