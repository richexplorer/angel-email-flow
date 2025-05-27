import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Linkedin, MapPin, Building, Phone, Mail, Github } from 'lucide-react';

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

interface LinkedInProfileProps {
  selectedLead: Lead | null;
}

export const LinkedInProfile = ({ selectedLead }: LinkedInProfileProps) => {
  if (!selectedLead) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 border-r border-gray-200">
        <div className="text-center">
          <Linkedin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Lead Selected</h3>
          <p className="text-gray-600">Select a lead from the list to view their LinkedIn profile</p>
        </div>
      </div>
    );
  }

  const openLinkedIn = () => {
    if (selectedLead['Linkedin Url']) {
      const url = selectedLead['Linkedin Url'].replace(/^http:/, 'https:');
      window.open(url, '_blank');
    }
  };

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      {/* Concise Profile Info - Top 20% */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-semibold">
              {selectedLead['First Name']} {selectedLead['Last Name']}
            </h2>
            <p className="text-gray-600">{selectedLead['Title']}</p>
          </div>
          {selectedLead['Linkedin Url'] && (
            <Button onClick={openLinkedIn} variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in New Tab
            </Button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4 text-gray-500" />
            <span>{selectedLead['Company Name']}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span>{selectedLead['City']}, {selectedLead['State']}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-gray-500" />
            <span>{selectedLead['Email']}</span>
          </div>
          {selectedLead['Phone'] && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-500" />
              <span>{selectedLead['Phone']}</span>
            </div>
          )}
        </div>
      </div>

      {/* LinkedIn iframe - Bottom 80% */}
      <div className="flex-1 bg-white">
        {selectedLead['Linkedin Url'] && (
          <>
            <div className="p-2 bg-yellow-50 border-b border-yellow-200">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> This iframe will only work on localhost. For deployed versions, use the "Open in New Tab" button above.
              </p>
            </div>
            <iframe
              src={selectedLead['Linkedin Url'].replace(/^http:/, 'https:')}
              className="w-full h-full"
              style={{ minHeight: 'calc(80vh - 200px)' }}
              frameBorder="0"
              title="LinkedIn Profile"
            />
          </>
        )}
      </div>
    </div>
  );
};
