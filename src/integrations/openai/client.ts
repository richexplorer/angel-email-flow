import OpenAI from 'openai';
import { getSettings } from '@/lib/settings';

export const createOpenAIClient = () => {
  const settings = getSettings();
  if (!settings.openaiApiKey) {
    return null;
  }
  
  return new OpenAI({
    apiKey: settings.openaiApiKey,
    dangerouslyAllowBrowser: true // Since we're calling from the browser
  });
};

export const openai = createOpenAIClient(); 