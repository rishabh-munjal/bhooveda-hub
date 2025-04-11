
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, MapPin, Building, DollarSign, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import PropertyCharts from "./PropertyCharts";

type SearchResult = {
  address_id: number;
  street: string;
  city: string;
  state: string;
  postal_code: string;
  building_restrictions: any[];
  land_costs: any[];
  zoning_info: any;
  future_price_projections: any[];
};

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedCards, setExpandedCards] = useState<number[]>([]);

  const toggleCardExpansion = (id: number) => {
    setExpandedCards(prev => 
      prev.includes(id) ? prev.filter(cardId => cardId !== id) : [...prev, id]
    );
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      toast({
        title: "Search term required",
        description: "Please enter an address, city, state, or postal code to search",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    setSearchResults([]);
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
        .or(`street.ilike.%${query}%,city.ilike.%${query}%,state.ilike.%${query}%,postal_code.ilike.%${query}%`);

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
      } else {
        toast({
          title: "Search results found",
          description: `Found ${addresses.length} matching properties`,
          variant: "default",
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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
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
            className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors duration-200 disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Searching...</span>
              </>
            ) : (
              <span>Search</span>
            )}
          </button>
        </div>
      </form>

      {searchResults.length > 0 && (
        <div className="space-y-6">
          {searchResults.map((address) => (
            <Card 
              key={address.address_id} 
              className="overflow-hidden hover:shadow-md transition-shadow duration-200 border-t-4 border-t-primary"
            >
              <CardHeader className="bg-gray-50 pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <MapPin className="h-5 w-5 text-primary" />
                      {address.street}
                    </CardTitle>
                    <CardDescription className="mt-1 text-base">
                      {address.city}, {address.state} {address.postal_code}
                    </CardDescription>
                  </div>
                  {address.zoning_info && (
                    <Badge variant="outline" className="bg-primary/10 text-primary font-medium">
                      {address.zoning_info.zone_name}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-4 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Building Restrictions Summary */}
                  {address.building_restrictions && address.building_restrictions.length > 0 && (
                    <div className="flex items-start space-x-3">
                      <Building className="h-5 w-5 text-orange-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-sm">Building Restrictions</h4>
                        <p className="text-sm text-gray-600">
                          {address.building_restrictions.length} restrictions apply
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {/* Zoning Info Summary */}
                  {address.zoning_info && (
                    <div className="flex items-start space-x-3">
                      <Building className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-sm">Zoning Information</h4>
                        <p className="text-sm text-gray-600">
                          Max Height: {address.zoning_info.max_building_height || 'N/A'}ft
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {/* Land Cost Summary */}
                  {address.land_costs && address.land_costs.length > 0 && (
                    <div className="flex items-start space-x-3">
                      <DollarSign className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-sm">Land Cost</h4>
                        <p className="text-sm text-gray-600">
                          ${address.land_costs[0]?.estimated_cost_per_sqft || 'N/A'} per sqft
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {/* Price Projection Summary */}
                  {address.future_price_projections && address.future_price_projections.length > 0 && (
                    <div className="flex items-start space-x-3">
                      <TrendingUp className="h-5 w-5 text-purple-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-sm">Price Projection</h4>
                        <p className="text-sm text-gray-600">
                          +{address.future_price_projections[0]?.projected_increase_percentage || 'N/A'}% growth expected
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Visual Charts */}
                {expandedCards.includes(address.address_id) && (
                  <>
                    <PropertyCharts 
                      zoningInfo={address.zoning_info}
                      landCosts={address.land_costs}
                      priceProjections={address.future_price_projections}
                    />
                    
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <div className="grid grid-cols-1 gap-6">
                        {/* Building Restrictions Details */}
                        {address.building_restrictions && address.building_restrictions.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-sm mb-2 flex items-center">
                              <Building className="h-4 w-4 text-orange-500 mr-2" />
                              Building Restrictions
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {address.building_restrictions.map((restriction: any) => (
                                <div key={restriction.restriction_id} className="bg-gray-50 p-3 rounded-md">
                                  <p className="font-medium text-sm">{restriction.restriction_type}</p>
                                  <p className="text-sm">{restriction.restriction_value}</p>
                                  {restriction.notes && (
                                    <p className="text-xs text-gray-600 mt-1">{restriction.notes}</p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Zoning Information Details */}
                        {address.zoning_info && (
                          <div>
                            <h4 className="font-semibold text-sm mb-2 flex items-center">
                              <Building className="h-4 w-4 text-blue-500 mr-2" />
                              Zoning Information
                            </h4>
                            <div className="bg-gray-50 p-3 rounded-md">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                                <p className="text-sm"><span className="font-medium">Zone:</span> {address.zoning_info.zone_name}</p>
                                {address.zoning_info.max_building_height && (
                                  <p className="text-sm"><span className="font-medium">Max Height:</span> {address.zoning_info.max_building_height}ft</p>
                                )}
                                {address.zoning_info.density_limit && (
                                  <p className="text-sm"><span className="font-medium">Density Limit:</span> {address.zoning_info.density_limit}</p>
                                )}
                                {address.zoning_info.min_front_setback && (
                                  <p className="text-sm"><span className="font-medium">Front Setback:</span> {address.zoning_info.min_front_setback}ft</p>
                                )}
                                {address.zoning_info.permitted_land_uses && (
                                  <p className="text-sm col-span-2"><span className="font-medium">Permitted Uses:</span> {address.zoning_info.permitted_land_uses}</p>
                                )}
                                {address.zoning_info.effective_date && (
                                  <p className="text-sm"><span className="font-medium">Effective Date:</span> {formatDate(address.zoning_info.effective_date)}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Land Costs Details */}
                        {address.land_costs && address.land_costs.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-sm mb-2 flex items-center">
                              <DollarSign className="h-4 w-4 text-green-500 mr-2" />
                              Land Costs
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {address.land_costs.map((cost: any) => (
                                <div key={cost.cost_id} className="bg-gray-50 p-3 rounded-md">
                                  <p className="text-sm"><span className="font-medium">Cost per sqft:</span> ${cost.estimated_cost_per_sqft}</p>
                                  <p className="text-sm"><span className="font-medium">Data Source:</span> {cost.data_source}</p>
                                  {cost.date_of_estimation && (
                                    <p className="text-sm">
                                      <span className="font-medium">Estimated on:</span> {formatDate(cost.date_of_estimation)}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Price Projections Details */}
                        {address.future_price_projections && address.future_price_projections.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-sm mb-2 flex items-center">
                              <TrendingUp className="h-4 w-4 text-purple-500 mr-2" />
                              Price Projections
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {address.future_price_projections.map((projection: any) => (
                                <div key={projection.projection_id} className="bg-gray-50 p-3 rounded-md">
                                  <p className="text-sm">
                                    <span className="font-medium">Projected Increase:</span> {projection.projected_increase_percentage}%
                                  </p>
                                  {projection.projection_date && (
                                    <p className="text-sm">
                                      <span className="font-medium">As of:</span> {formatDate(projection.projection_date)}
                                    </p>
                                  )}
                                  {projection.analysis_details && (
                                    <p className="text-xs text-gray-600 mt-1">{projection.analysis_details}</p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
              <CardFooter className="pt-0 flex justify-center bg-white">
                <Button 
                  variant="outline" 
                  onClick={() => toggleCardExpansion(address.address_id)}
                  className="text-sm hover:bg-gray-100 border-primary text-primary hover:text-primary"
                >
                  {expandedCards.includes(address.address_id) ? "Show Less" : "Show Charts & Details"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
