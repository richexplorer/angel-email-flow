import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: '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',
  dangerouslyAllowBrowser: true // Since we're calling from the browser
}); 