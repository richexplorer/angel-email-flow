
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
    console.log('Filtering leads with search term:', searchTerm);
    console.log('Total leads to filter:', leads.length);
    
    const filtered = leads.filter(lead => 
      `${lead['First Name']} ${lead['Last Name']}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead['Company Name']?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead['Title']?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead['Email']?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    console.log('Filtered leads count:', filtered.length);
    setFilteredLeads(filtered);
  }, [leads, searchTerm]);

  const fetchLeads = async () => {
  setLoading(true);
  console.log('Fetching from table: vaasu_angels');

  const { data, error } = await supabase
    .from('vaasu_angels')
    .select('*')  // Temporarily select everything to test

  console.log('Supabase response:', { data, error });

  if (error) {
    toast({
      title: "Database Error",
      description: `Failed to fetch leads: ${error.message}`,
      variant: "destructive",
    });
    setLoading(false);
    return;
  }

  if (!data || data.length === 0) {
    toast({
      title: "No Data Found",
      description: "Table exists but returned no data. Check RLS policies.",
      variant: "destructive",
    });
  } else {
    setLeads(data);
    console.log('Data fetched:', data);
  }

  setLoading(false);
};

  const isSelected = (lead: Lead) => {
    return selectedLead && 
           selectedLead['First Name'] === lead['First Name'] && 
           selectedLead['Last Name'] === lead['Last Name'] &&
           selectedLead['Email'] === lead['Email'];
  };

  console.log('Render: Loading state:', loading);
  console.log('Render: Leads count:', leads.length);
  console.log('Render: Filtered leads count:', filteredLeads.length);

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
        <h2 className="text-lg font-semibold mb-3">
          Angel Leads ({filteredLeads.length} of {leads.length})
        </h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search leads by name, company, title, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        {filteredLeads.length === 0 ? (
          <div className="text-center p-4">
            <User className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">
              {leads.length === 0 ? 'No leads found in database' : 'No leads match your search'}
            </p>
          </div>
        ) : (
          filteredLeads.map((lead, index) => (
            <Card 
              key={`${lead['First Name']}-${lead['Last Name']}-${lead['Email']}-${index}`}
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
                      {lead['Title'] || 'No title'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {lead['Company Name'] || 'No company'}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {lead['Email'] || 'No email'}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {lead['City']}, {lead['State']} {lead['Country']}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
