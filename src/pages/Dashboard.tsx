import { useState } from 'react';
import { LeadsList } from '@/components/dashboard/LeadsList';
import { LinkedInProfile } from '@/components/dashboard/LinkedInProfile';
import { EmailGenerator } from '@/components/dashboard/EmailGenerator';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Button } from '@/components/ui/button';
import { Github } from 'lucide-react';

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

const Dashboard = () => {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  return (
    <div className="h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Lead Reachout Dashboard</h1>
        <Button 
          onClick={() => window.open('https://github.com/richexplorer/angel-email-flow', '_blank')}
          variant="default"
          size="sm"
          className="bg-gray-900 hover:bg-gray-800"
        >
          <Github className="h-4 w-4 mr-2" />
          Fork Repo
        </Button>
      </header>
      
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <LeadsList onSelectLead={setSelectedLead} selectedLead={selectedLead} />
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        <ResizablePanel defaultSize={40} minSize={30} maxSize={50}>
          <LinkedInProfile selectedLead={selectedLead} />
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        <ResizablePanel defaultSize={40} minSize={30} maxSize={50}>
          <EmailGenerator selectedLead={selectedLead} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Dashboard;
