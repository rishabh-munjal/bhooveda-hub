
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log('Searching for:', query); // Debug log

    try {
      const { data: addresses, error } = await supabase
        .from('addresses')
        .select(`
          *,
          building_restrictions (*),
          land_costs (*),
          zoning_info (*),
          future_price_projections (*)
        `)
        .or(`street.ilike.%${query}%`)
        .or(`city.ilike.%${query}%`)
        .or(`state.ilike.%${query}%`)
        .or(`postal_code.ilike.%${query}%`);

      console.log('Search results:', addresses); // Debug log
      console.log('Search error:', error); // Debug log

      if (error) {
        console.error('Search error:', error);
        throw error;
      }

      setSearchResults(addresses || []);
      
      if (!addresses || addresses.length === 0) {
        toast({
          title: "No results found",
          description: "Try searching with a different term",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error searching:', error);
      toast({
        title: "Error",
        description: "Failed to search addresses",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <form onSubmit={handleSearch} className="w-full">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by address, city, state, or postal code..."
            className="w-full px-6 py-4 text-lg rounded-full border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors duration-200 disabled:opacity-50"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {searchResults.length > 0 && (
        <div className="space-y-4">
          {searchResults.map((address) => (
            <Card key={address.address_id}>
              <CardHeader>
                <CardTitle>{address.street}</CardTitle>
                <CardDescription>
                  {address.city}, {address.state} {address.postal_code}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {address.building_restrictions?.map((restriction: any) => (
                    <div key={restriction.restriction_id} className="space-y-2">
                      <h4 className="font-semibold">Building Restriction</h4>
                      <p>{restriction.restriction_type}: {restriction.restriction_value}</p>
                      {restriction.notes && (
                        <p className="text-sm text-gray-600">{restriction.notes}</p>
                      )}
                    </div>
                  ))}
                  
                  {address.zoning_info && (
                    <div className="space-y-2">
                      <h4 className="font-semibold">Zoning Information</h4>
                      <p>Zone: {address.zoning_info.zone_name}</p>
                      {address.zoning_info.max_building_height && (
                        <p>Max Height: {address.zoning_info.max_building_height}ft</p>
                      )}
                      {address.zoning_info.density_limit && (
                        <p>Density Limit: {address.zoning_info.density_limit}</p>
                      )}
                    </div>
                  )}
                  
                  {address.land_costs?.map((cost: any) => (
                    <div key={cost.cost_id} className="space-y-2">
                      <h4 className="font-semibold">Land Cost</h4>
                      <p>Cost per sqft: ${cost.estimated_cost_per_sqft}</p>
                      {cost.date_of_estimation && (
                        <p className="text-sm text-gray-600">
                          Estimated on: {new Date(cost.date_of_estimation).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ))}
                  
                  {address.future_price_projections?.map((projection: any) => (
                    <div key={projection.projection_id} className="space-y-2">
                      <h4 className="font-semibold">Price Projection</h4>
                      <p>Projected Increase: {projection.projected_increase_percentage}%</p>
                      {projection.analysis_details && (
                        <p className="text-sm text-gray-600">
                          {projection.analysis_details}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
