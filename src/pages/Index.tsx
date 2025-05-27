import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Users2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

interface TableInfo {
  name: string;
  count: number;
  description: string;
  displayName: string;
  color: string;
}

// Define available tables and their descriptions
const AVAILABLE_TABLES = {
  'vaasu_angels': {
    description: 'Primary database of angel investor leads and their contact information',
    displayName: 'Angel Investors (Primary)',
    color: 'text-blue-600'
  },
  'vaasu_angels_2': {
    description: 'Secondary database of angel investor leads and additional contacts',
    displayName: 'Angel Investors (Secondary)',
    color: 'text-indigo-600'
  }
} as const;

type TableName = keyof typeof AVAILABLE_TABLES;

const Index = () => {
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    setLoading(true);
    try {
      // Fetch counts for both tables
      const [angels, angels2] = await Promise.all([
        supabase
          .from('vaasu_angels')
          .select('*', { count: 'exact', head: true }),
        // Use type assertion for the second table since it's not in the schema types
        supabase
          .from('vaasu_angels_2' as any)
          .select('*', { count: 'exact', head: true }) as unknown as Promise<{
            data: null;
            count: number | null;
            error: any;
          }>
      ]);

      const tableInfo = [
        {
          name: 'vaasu_angels',
          count: angels.count || 0,
          ...AVAILABLE_TABLES['vaasu_angels']
        },
        {
          name: 'vaasu_angels_2',
          count: angels2.count || 0,
          ...AVAILABLE_TABLES['vaasu_angels_2']
        }
      ];

      setTables(tableInfo);
    } catch (error) {
      console.error('Error fetching tables:', error);
      setTables(
        Object.entries(AVAILABLE_TABLES).map(([name, info]) => ({
          name,
          count: 0,
          ...info
        }))
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Angel Investor Databases
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Access and manage your angel investor leads from multiple sources.
            Select a database to view and manage its contents.
          </p>
        </div>

        {loading ? (
          <div className="text-center text-xl text-gray-600">Loading available databases...</div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {tables.map((table) => (
                <Card key={table.name} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <Users2 className={`h-6 w-6 ${table.color}`} />
                      <CardTitle>
                        {table.displayName}
                      </CardTitle>
                    </div>
                    <CardDescription>
                      {table.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <Badge variant="secondary" className="bg-gray-100">
                        {table.count.toLocaleString()} records
                      </Badge>
                      <Link to={`/dashboard?table=${table.name}`}>
                        <Button variant="outline" className={`hover:bg-${table.color}/10`}>
                          Access Data
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {!loading && tables.length === 0 && (
          <div className="text-center text-gray-600">
            <p className="text-xl mb-4">No databases available</p>
            <p>Please check your database configuration or contact support.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
