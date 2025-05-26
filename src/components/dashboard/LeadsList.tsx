
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, User } from 'lucide-react';
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

interface LeadsListProps {
  onSelectLead: (lead: Lead) => void;
  selectedLead: Lead | null;
}

export const LeadsList = ({ onSelectLead, selectedLead }: LeadsListProps) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    const filtered = leads.filter(lead => 
      `${lead['First Name']} ${lead['Last Name']}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead['Company Name']?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead['Title']?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLeads(filtered);
  }, [leads, searchTerm]);

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('Vaasu Angels (4.5K)')
        .select('*')
        .order('First Name');

      if (error) {
        console.error('Error fetching leads:', error);
        toast({
          title: "Error",
          description: "Failed to fetch leads from database",
          variant: "destructive",
        });
        return;
      }

      setLeads(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const isSelected = (lead: Lead) => {
    return selectedLead && 
           selectedLead['First Name'] === lead['First Name'] && 
           selectedLead['Last Name'] === lead['Last Name'] &&
           selectedLead['Email'] === lead['Email'];
  };

  if (loading) {
    return (
      <div className="h-full p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading leads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col border-r border-gray-200 bg-gray-50">
      <div className="p-4 border-b border-gray-200 bg-white">
        <h2 className="text-lg font-semibold mb-3">Leads ({filteredLeads.length})</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        {filteredLeads.map((lead, index) => (
          <Card 
            key={index}
            className={`mb-2 cursor-pointer transition-all hover:shadow-md ${
              isSelected(lead) ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-white'
            }`}
            onClick={() => onSelectLead(lead)}
          >
            <CardContent className="p-3">
              <div className="flex items-start space-x-3">
                <div className="bg-gray-200 rounded-full p-2 flex-shrink-0">
                  <User className="h-4 w-4 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm text-gray-900 truncate">
                    {lead['First Name']} {lead['Last Name']}
                  </h3>
                  <p className="text-xs text-gray-600 truncate">
                    {lead['Title']}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {lead['Company Name']}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {lead['City']}, {lead['State']}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
