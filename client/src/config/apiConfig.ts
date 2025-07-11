// API Configuration Validation
export const validateAPIConfig = (): { configured: string[]; missing: string[] } => {
  const configured: string[] = [];
  const missing: string[] = [];

  // Check Gemini AI
  if (import.meta.env.VITE_GEMINI_API_KEY) {
    configured.push('Gemini AI');
  } else {
    missing.push('Gemini AI');
  }

  // Check OpenAI
  if (import.meta.env.VITE_OPENAI_API_KEY) {
    configured.push('OpenAI GPT');
  } else {
    missing.push('OpenAI GPT');
  }

  // Check other services
  if (import.meta.env.VITE_ANTHROPIC_API_KEY) {
    configured.push('Anthropic Claude');
  } else {
    missing.push('Anthropic Claude');
  }

  return { configured, missing };
};

export const getAPIKeys = () => ({
  gemini: import.meta.env.VITE_GEMINI_API_KEY,
  openai: import.meta.env.VITE_OPENAI_API_KEY,
  anthropic: import.meta.env.VITE_ANTHROPIC_API_KEY,
});

export const isAIConfigured = (): boolean => {
  const { missing } = validateAPIConfig();
  return missing.length === 0;
};