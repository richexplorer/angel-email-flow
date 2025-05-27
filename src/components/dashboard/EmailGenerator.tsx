import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Wand2, Copy, Send, Mic, MicOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { openai } from '@/integrations/openai/client';
import { SettingsDialog } from './SettingsDialog';
import { getSettings, type UserSettings } from '@/lib/settings';

interface Lead {
  'First Name': string;
  'Last Name': string;
  'Title': string;
  'Company Name': string;
  'Linkedin Url': string;
  'Email': string;
  'Seniority': string;
  'Departments': string;
  'Phone': string;
  'City': string;
  'State': string;
  'Country': string;
  'Secondary Email': string;
}

interface EmailGeneratorProps {
  selectedLead: Lead | null;
}

const DEFAULT_TEMPLATE = `Hi {firstName},

{Super short 1 simple personalized line like Love your background in marketing, Are you actively Angel Investing? or Have been following you for a while, big fan!}

I am Shubham, Co-founder of Questera, building Agentic Customer Engagement Platform. Would love to connect and get some feedback about what we are building! 

{ONLY If I ask to add Blurb in the email in notes, then add the blurb saved in {userSettings.blurb}"}

Thanks,
Shubham
Co-founder, Questera`;

export const EmailGenerator = ({ selectedLead }: EmailGeneratorProps) => {
  const [userSettings, setUserSettings] = useState<UserSettings>(getSettings());
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [notes, setNotes] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [linkedinMessage, setLinkedinMessage] = useState('');
  const { toast } = useToast();

  // Load settings on mount
  useEffect(() => {
    setUserSettings(getSettings());
  }, []);

  const handleSettingsUpdate = (newSettings: UserSettings) => {
    setUserSettings(newSettings);
  };

  // Initialize speech recognition
  useEffect(() => {
    try {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = true;
        recognitionInstance.interimResults = false; // Changed to false for more stable results
        recognitionInstance.lang = 'en-US';

        recognitionInstance.onstart = () => {
          console.log('Voice recognition started');
          setIsRecording(true);
        };

        recognitionInstance.onresult = (event) => {
          const last = event.results.length - 1;
          const transcript = event.results[last][0].transcript;
          
          setNotes(prevNotes => {
            const separator = prevNotes.length > 0 ? ' ' : '';
            return prevNotes + separator + transcript;
          });
        };

        recognitionInstance.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          if (event.error === 'no-speech') {
            toast({
              title: "No Speech Detected",
              description: "Please try speaking again or check your microphone",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Voice Recognition Error",
              description: `Error: ${event.error}. Please try again.`,
              variant: "destructive",
            });
          }
          stopRecording(recognitionInstance);
        };

        recognitionInstance.onend = () => {
          console.log('Voice recognition ended');
          setIsRecording(false);
        };

        setRecognition(recognitionInstance);
      } else {
        console.error('Speech recognition not supported');
        toast({
          title: "Not Supported",
          description: "Voice recognition is not supported in your browser. Please use Chrome, Edge, or Safari.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error initializing speech recognition:', error);
      toast({
        title: "Initialization Error",
        description: "Failed to initialize voice recognition. Please try again.",
        variant: "destructive",
      });
    }

    return () => {
      if (recognition) {
        stopRecording(recognition);
      }
    };
  }, []);

  const stopRecording = useCallback((recognitionInstance: SpeechRecognition) => {
    try {
      recognitionInstance.stop();
      setIsRecording(false);
    } catch (error) {
      console.error('Error stopping recognition:', error);
    }
  }, []);

  const startRecording = useCallback((recognitionInstance: SpeechRecognition) => {
    try {
      recognitionInstance.start();
      toast({
        title: "Recording Started",
        description: "Speak now to add notes...",
      });
    } catch (error) {
      console.error('Error starting recognition:', error);
      toast({
        title: "Start Error",
        description: "Failed to start recording. Please try again.",
        variant: "destructive",
      });
      setIsRecording(false);
    }
  }, [toast]);

  const toggleRecording = useCallback(() => {
    if (!recognition) {
      toast({
        title: "Not Available",
        description: "Voice recognition is not available. Please try reloading the page.",
        variant: "destructive",
      });
      return;
    }

    if (isRecording) {
      stopRecording(recognition);
      toast({
        title: "Recording Stopped",
        description: "Voice recording has been stopped",
      });
    } else {
      startRecording(recognition);
    }
  }, [recognition, isRecording, startRecording, stopRecording, toast]);

  const generatePersonalizedEmail = async () => {
    if (!selectedLead) {
      toast({
        title: "No Lead Selected",
        description: "Please select a lead first",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const shouldAddBlurb = notes.toLowerCase().includes('blurb');
      
      const systemPrompt = `You are an expert at writing personalized, professional emails. 
Your task is to generate a highly personalized email based on the lead's information and any provided notes.
The email should be warm, professional, and incorporate specific details about the person naturally.
If notes are provided, use them to make the email more personalized and relevant.

The email should be along the lines of the following format (KEEP IT SIMPLE & SHORT):
${userSettings.template}

${shouldAddBlurb ? `When adding the blurb, format it in italics using markdown (*text*)` : ''}`;

      const userPrompt = `Please write a personalized email for a lead with the following information:

Lead Details:
- Name: ${selectedLead['First Name']} ${selectedLead['Last Name']}
- Title: ${selectedLead['Title']}
- Company: ${selectedLead['Company Name']}
- Location: ${selectedLead['City']}, ${selectedLead['State']}, ${selectedLead['Country']}
- Department: ${selectedLead['Departments']}
- Seniority: ${selectedLead['Seniority']}

${notes ? `Additional Notes:\n${notes}\n` : ''}

Please replace any placeholders in the template with appropriate content, and use my information:
- My Name: ${userSettings.name}
- My Title: ${userSettings.title}
${shouldAddBlurb ? `- Company Blurb: ${userSettings.blurb}` : ''}`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
      });

      const generatedContent = completion.choices[0]?.message?.content;
      
      if (!generatedContent) {
        throw new Error("No content generated");
      }

      setGeneratedEmail(generatedContent);
      setSubject(`${selectedLead['First Name']} <> ${userSettings.name}`);
    } catch (error) {
      console.error('Email generation error:', error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate personalized email",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateLinkedInMessage = async () => {
    if (!selectedLead) {
      toast({
        title: "No Lead Selected",
        description: "Please select a lead first",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const systemPrompt = `You are an expert at writing personalized LinkedIn connection messages.
Your task is to generate a short, friendly, and personalized connection message based on the lead's information.
The message should be ONE LINE ONLY and should feel natural and engaging.
Use one of the provided templates and customize it for the person.`;

      const userPrompt = `Please write a personalized LinkedIn message for a lead with the following information:

Lead Details:
- Name: ${selectedLead['First Name']} ${selectedLead['Last Name']}
- Title: ${selectedLead['Title']}
- Company: ${selectedLead['Company Name']}
- Department: ${selectedLead['Departments']}
- Seniority: ${selectedLead['Seniority']}

Available templates (choose and customize one):
${userSettings.linkedinTemplates.map(template => `- ${template}`).join('\n')}

Please replace any placeholders with appropriate content and make it feel personal.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
      });

      const generatedContent = completion.choices[0]?.message?.content;
      
      if (!generatedContent) {
        throw new Error("No content generated");
      }

      setLinkedinMessage(generatedContent.trim());
      toast({
        title: "LinkedIn Message Generated",
        description: "Click to copy the message",
      });
    } catch (error) {
      console.error('LinkedIn message generation error:', error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate LinkedIn message",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedEmail);
    toast({
      title: "Copied",
      description: "Email copied to clipboard",
    });
  };

  const copyLinkedInMessage = () => {
    if (linkedinMessage) {
      navigator.clipboard.writeText(linkedinMessage);
      toast({
        title: "Copied",
        description: "LinkedIn message copied to clipboard",
      });
    }
  };

  const openEmailClient = () => {
    if (!selectedLead || !generatedEmail) return;
    
    const mailtoLink = `mailto:${selectedLead['Email']}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(generatedEmail)}`;
    window.open(mailtoLink);
  };

  if (!selectedLead) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Email Generator</h3>
          <p className="text-gray-600">Select a lead to generate personalized emails</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Email Generator</h2>
            <p className="text-sm text-gray-600">
              Generate personalized emails for {selectedLead['First Name']} {selectedLead['Last Name']}
            </p>
          </div>
          <SettingsDialog onSaveSettings={handleSettingsUpdate} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-base">Notes About Lead</CardTitle>
              <Button
                variant="outline"
                size="icon"
                className={`w-8 h-8 ${isRecording ? 'bg-red-50 text-red-600 hover:bg-red-100' : ''}`}
                onClick={toggleRecording}
                title={isRecording ? "Stop recording" : "Start recording"}
              >
                {isRecording ? (
                  <MicOff className="h-4 w-4" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any personal notes, insights, or context about this lead that should be considered when generating the email... Click the microphone icon to use voice-to-text. If you want to add a blurb, just say 'blurb' and I will add it to the email."
              className="min-h-[100px]"
            />
            {isRecording && (
              <div className="flex items-center justify-between mt-2">
                <p className="text-sm text-red-600 flex items-center">
                  <span className="inline-block w-2 h-2 bg-red-600 rounded-full mr-2 animate-pulse"></span>
                  Recording in progress...
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={toggleRecording}
                >
                  Stop Recording
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <Button 
            onClick={generatePersonalizedEmail} 
            disabled={isGenerating}
            className="flex-1"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating...
              </>
            ) : (
              <>
                <Mail className="h-4 w-4 mr-2" />
                Generate Email
              </>
            )}
          </Button>

          <Button 
            onClick={generateLinkedInMessage}
            disabled={isGenerating}
            variant="secondary"
            className="flex-1"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                Generating...
              </>
            ) : (
              <>
                <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                </svg>
                Generate LinkedIn
              </>
            )}
          </Button>
        </div>

        {linkedinMessage && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">LinkedIn Connection Message</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-md">
                <p className="text-sm">{linkedinMessage}</p>
              </div>
              <Button onClick={copyLinkedInMessage} variant="outline" className="w-full">
                <Copy className="h-4 w-4 mr-2" />
                Copy LinkedIn Message
              </Button>
            </CardContent>
          </Card>
        )}

        {generatedEmail && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Generated Email</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="email-body">Email Body</Label>
                <Textarea
                  id="email-body"
                  value={generatedEmail}
                  onChange={(e) => setGeneratedEmail(e.target.value)}
                  className="min-h-[200px] mt-1"
                />
              </div>

              <div className="flex space-x-2">
                <Button onClick={copyToClipboard} variant="outline" className="flex-1">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button onClick={openEmailClient} className="flex-1">
                  <Send className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
