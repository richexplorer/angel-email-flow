
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Wand2, Copy, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

export const EmailGenerator = ({ selectedLead }: EmailGeneratorProps) => {
  const [emailTemplate, setEmailTemplate] = useState(`Hi {firstName},

I hope this message finds you well. I came across your profile and was impressed by your role as {title} at {company}.

I wanted to reach out because [reason for reaching out].

Would you be interested in a brief conversation about [specific topic or opportunity]?

Best regards,
[Your Name]`);

  const [generatedEmail, setGeneratedEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generatePersonalizedEmail = () => {
    if (!selectedLead) {
      toast({
        title: "No Lead Selected",
        description: "Please select a lead first",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI generation with template replacement
    setTimeout(() => {
      let personalizedEmail = emailTemplate
        .replace(/{firstName}/g, selectedLead['First Name'])
        .replace(/{lastName}/g, selectedLead['Last Name'])
        .replace(/{title}/g, selectedLead['Title'] || 'your role')
        .replace(/{company}/g, selectedLead['Company Name'] || 'your company')
        .replace(/{city}/g, selectedLead['City'] || '')
        .replace(/{state}/g, selectedLead['State'] || '')
        .replace(/{department}/g, selectedLead['Departments'] || '');

      setGeneratedEmail(personalizedEmail);
      setSubject(`Introduction - ${selectedLead['First Name']} ${selectedLead['Last Name']}`);
      setIsGenerating(false);
      
      toast({
        title: "Email Generated",
        description: "Personalized email has been generated successfully",
      });
    }, 1500);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedEmail);
    toast({
      title: "Copied",
      description: "Email copied to clipboard",
    });
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
        <h2 className="text-lg font-semibold">Email Generator</h2>
        <p className="text-sm text-gray-600">
          Generate personalized emails for {selectedLead['First Name']} {selectedLead['Last Name']}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Email Template</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={emailTemplate}
              onChange={(e) => setEmailTemplate(e.target.value)}
              placeholder="Enter your email template..."
              className="min-h-[150px]"
            />
            <p className="text-xs text-gray-500 mt-2">
              Use placeholders: {'{firstName}'}, {'{lastName}'}, {'{title}'}, {'{company}'}, {'{city}'}, {'{state}'}, {'{department}'}
            </p>
          </CardContent>
        </Card>

        <Button 
          onClick={generatePersonalizedEmail} 
          disabled={isGenerating}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Generating...
            </>
          ) : (
            <>
              <Wand2 className="h-4 w-4 mr-2" />
              Generate Personalized Email
            </>
          )}
        </Button>

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
