import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Linkedin, MapPin, Building, Phone, Mail } from 'lucide-react';

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
      window.open(selectedLead['Linkedin Url'], '_blank');
    }
  };

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">LinkedIn Profile</h2>
          {selectedLead['Linkedin Url'] && (
            <Button onClick={openLinkedIn} variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              Open LinkedIn
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 rounded-full p-3">
                <Linkedin className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-xl">
                  {selectedLead['First Name']} {selectedLead['Last Name']}
                </CardTitle>
                <p className="text-gray-600">{selectedLead['Title']}</p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center space-x-3">
                <Building className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium">{selectedLead['Company Name']}</p>
                  <p className="text-sm text-gray-600">{selectedLead['Departments']}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-gray-500" />
                <p>{selectedLead['City']}, {selectedLead['State']}, {selectedLead['Country']}</p>
              </div>

              {selectedLead['Phone'] && (
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-500" />
                  <p>{selectedLead['Phone']}</p>
                </div>
              )}

              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-500" />
                <div>
                  <p>{selectedLead['Email']}</p>
                  {selectedLead['Secondary Email'] && (
                    <p className="text-sm text-gray-600">{selectedLead['Secondary Email']}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2">Professional Details</h4>
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium text-gray-600">Seniority: </span>
                  <span className="text-sm">{selectedLead['Seniority'] || 'Not specified'}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Department: </span>
                  <span className="text-sm">{selectedLead['Departments'] || 'Not specified'}</span>
                </div>
              </div>
            </div>

            {selectedLead['Linkedin Url'] && (
              <div className="pt-4">
                <iframe
                  src={selectedLead['Linkedin Url']}
                  height="400"
                  width="100%"
                  frameBorder="0"
                  allowTransparency={true}
                  title="LinkedIn Profile"
                  className="rounded-lg border"
                  onError={() => console.log('LinkedIn embed failed - this is normal due to LinkedIn restrictions')}
                />
                <p className="text-xs text-gray-500 mt-2">
                  Note: LinkedIn embeds may not work due to their security policies. Use the "Open LinkedIn" button above.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
