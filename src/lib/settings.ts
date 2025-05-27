interface UserSettings {
  name: string;
  title: string;
  template: string;
  blurb: string;
  linkedinTemplates: string[];
  openaiApiKey?: string;
}

const DEFAULT_SETTINGS: UserSettings = {
  name: 'Shubham',
  title: 'Co-founder, Questera',
  template: `Hi {firstName},

{Super short 1 simple personalized line like Love your background in marketing, Are you actively Angel Investing? or Have been following you for a while, big fan!}

I am Shubham, Co-founder of Questera, building Agentic Customer Engagement Platform. Would love to connect and get some feedback about what we are building! 

{ONLY If I ask to add Blurb in the email in notes, then add the blurb saved in {userSettings.blurb}"}

Thanks,
Shubham
Co-founder, Questera`,
  blurb: "Here is a quick intro — Questera is the first Agentic customer engagement platform powering lifecycle marketers to predict user behavior and launch hyper-personalized campaigns, unlocking millions in revenue growth. Our team previously worked in Data & AI Infra at Amazon, Nvidia & LinkedIn and have been building in the personalization problem space for over a decade. We are post-revenue and starting up our seed round soon.",
  linkedinTemplates: [
    "Love your background in {department}, would love to connect!",
    "Really impressed by your work at {company}, would love to connect!",
    "Fellow {department} enthusiast here, would love to connect!",
    "Your experience in {industry} caught my eye, would love to connect!",
    "Big fan of your work in the {department} space, would love to connect!"
  ],
  openaiApiKey: ''
};

export const getSettings = (): UserSettings => {
  const savedSettings = localStorage.getItem('emailSettings');
  if (savedSettings) {
    try {
      const parsed = JSON.parse(savedSettings);
      return { ...DEFAULT_SETTINGS, ...parsed };
    } catch (error) {
      console.error('Error parsing settings:', error);
      return DEFAULT_SETTINGS;
    }
  }
  return DEFAULT_SETTINGS;
};

export const saveSettings = (settings: Partial<UserSettings>) => {
  const currentSettings = getSettings();
  const newSettings = { ...currentSettings, ...settings };
  localStorage.setItem('emailSettings', JSON.stringify(newSettings));
  return newSettings;
};

export type { UserSettings }; 