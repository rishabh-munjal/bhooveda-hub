
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Database } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type ScrapedProperty = {
  address_id: number;
  street: string;
  city: string;
};

const WebScraper = () => {
  const [state, setState] = useState<string>('Delhi');
  const [source, setSource] = useState<string>('magicbricks');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [results, setResults] = useState<ScrapedProperty[]>([]);

  const handleScrape = async () => {
    if (!state || !source) {
      toast({
        title: "Missing information",
        description: "Please select both a state and a data source",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResults([]);

    try {
      const { data, error } = await supabase.functions.invoke('scraper', {
        body: { state, source },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.success) {
        setResults(data.properties);
        toast({
          title: "Scraping completed",
          description: `Successfully scraped and stored ${data.properties.length} properties`,
          variant: "default",
        });
      } else {
        throw new Error(data.error || "Failed to scrape data");
      }
    } catch (error) {
      console.error("Error scraping:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to scrape data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200">
        <CardHeader className="bg-gray-50 pb-4">
          <CardTitle className="text-xl flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            Land Data Scraper
          </CardTitle>
          <CardDescription>
            Automatically gather property data from popular Indian real estate websites
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                State/Union Territory
              </label>
              <Select value={state} onValueChange={setState}>
                <SelectTrigger id="state">
                  <SelectValue placeholder="Select a state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Delhi">Delhi</SelectItem>
                  <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                  <SelectItem value="Karnataka">Karnataka</SelectItem>
                  <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                  <SelectItem value="Telangana">Telangana</SelectItem>
                  <SelectItem value="Uttar Pradesh">Uttar Pradesh</SelectItem>
                  <SelectItem value="Gujarat">Gujarat</SelectItem>
                  <SelectItem value="West Bengal">West Bengal</SelectItem>
                  <SelectItem value="Haryana">Haryana</SelectItem>
                  <SelectItem value="Kerala">Kerala</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="source" className="block text-sm font-medium text-gray-700">
                Data Source
              </label>
              <Select value={source} onValueChange={setSource}>
                <SelectTrigger id="source">
                  <SelectValue placeholder="Select a source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="magicbricks">MagicBricks</SelectItem>
                  <SelectItem value="99acres">99acres</SelectItem>
                  <SelectItem value="housing">Housing.com</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button 
            onClick={handleScrape} 
            disabled={isLoading} 
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Scraping Data...
              </>
            ) : (
              'Start Scraping'
            )}
          </Button>
          
          {results.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Scraped Properties</h3>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Street</TableHead>
                      <TableHead>City</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.map((property) => (
                      <TableRow key={property.address_id}>
                        <TableCell>{property.address_id}</TableCell>
                        <TableCell>{property.street}</TableCell>
                        <TableCell>{property.city}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                These properties have been added to your database and will appear in search results.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WebScraper;
