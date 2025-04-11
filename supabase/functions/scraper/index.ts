
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.1";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    const { source, state } = await req.json();
    
    if (!source || !state) {
      return new Response(
        JSON.stringify({ error: "Source URL and state are required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    console.log(`Starting scrape for ${source} in ${state}`);
    
    // Create Supabase client
    const supabaseUrl = "https://ydbfuilqiyehzvkyobwh.supabase.co";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Scrape data based on source
    let scrapedData = [];
    
    if (source === "magicbricks") {
      scrapedData = await scrapeMagicBricks(state);
    } else if (source === "99acres") {
      scrapedData = await scrape99Acres(state);
    } else if (source === "housing") {
      scrapedData = await scrapeHousing(state);
    } else {
      return new Response(
        JSON.stringify({ error: "Unsupported source" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    // Insert scraped data into database
    const insertResults = [];
    
    for (const property of scrapedData) {
      // First insert the address
      const { data: addressData, error: addressError } = await supabase
        .from("addresses")
        .insert({
          street: property.street,
          city: property.city,
          state: property.state,
          postal_code: property.postal_code,
          latitude: property.latitude,
          longitude: property.longitude
        })
        .select();
        
      if (addressError) {
        console.error("Error inserting address:", addressError);
        continue;
      }
      
      const addressId = addressData[0].address_id;
      
      // Insert land costs
      if (property.cost_per_sqft) {
        const { error: costError } = await supabase
          .from("land_costs")
          .insert({
            address_id: addressId,
            estimated_cost_per_sqft: property.cost_per_sqft,
            date_of_estimation: new Date().toISOString().split('T')[0],
            data_source: source
          });
          
        if (costError) {
          console.error("Error inserting land cost:", costError);
        }
      }
      
      // Insert zoning info if available
      if (property.zone_name) {
        const { data: zoningData, error: zoningError } = await supabase
          .from("zoning_info")
          .insert({
            zone_name: property.zone_name,
            permitted_land_uses: property.permitted_uses,
            max_building_height: property.max_height
          })
          .select();
          
        if (zoningError) {
          console.error("Error inserting zoning info:", zoningError);
        } else {
          // Update address with zoning id
          await supabase
            .from("addresses")
            .update({ zoning_id: zoningData[0].zoning_id })
            .eq("address_id", addressId);
        }
      }
      
      insertResults.push({
        address_id: addressId,
        street: property.street,
        city: property.city
      });
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Scraped and stored ${insertResults.length} properties`,
        properties: insertResults
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
    
  } catch (error) {
    console.error("Error in scraper function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});

// Scraper implementation for MagicBricks
async function scrapeMagicBricks(state: string) {
  try {
    const url = `https://www.magicbricks.com/property-for-sale/residential-real-estate?bedroom=&proptype=Multistorey-Apartment,Builder-Floor-Apartment,Penthouse,Studio-Apartment,Residential-House,Villa&cityName=${encodeURIComponent(state)}`;
    
    const response = await fetch(url);
    const html = await response.text();
    
    const parser = new DOMParser();
    const document = parser.parseFromString(html, "text/html");
    
    if (!document) {
      throw new Error("Failed to parse HTML document");
    }
    
    const properties = [];
    const propertyCards = document.querySelectorAll(".mb-srp__card");
    
    for (let i = 0; i < Math.min(propertyCards.length, 10); i++) {
      const card = propertyCards[i];
      
      // Extract location details
      const locationElem = card.querySelector(".mb-srp__card--address");
      const locationText = locationElem ? locationElem.textContent.trim() : "";
      
      // Extract price
      const priceElem = card.querySelector(".mb-srp__card__price--amount");
      const priceText = priceElem ? priceElem.textContent.trim() : "";
      
      // Extract area
      const areaElem = card.querySelector(".mb-srp__card__summary--value");
      const areaText = areaElem ? areaElem.textContent.trim() : "";
      
      // Parse location to get city and address parts
      const locationParts = locationText.split(',').map(part => part.trim());
      const city = locationParts.length > 1 ? locationParts[locationParts.length - 2] : "";
      const street = locationParts.length > 0 ? locationParts[0] : "";
      
      // Calculate approximate cost per sqft
      let costPerSqft = null;
      if (priceText && areaText) {
        // Convert price from lakhs/crores to actual number
        let priceValue = 0;
        if (priceText.includes('Cr')) {
          priceValue = parseFloat(priceText.replace(' Cr', '')) * 10000000;
        } else if (priceText.includes('Lac')) {
          priceValue = parseFloat(priceText.replace(' Lac', '')) * 100000;
        }
        
        // Extract area in sqft
        const areaMatch = areaText.match(/\d+(\.\d+)?/);
        const area = areaMatch ? parseFloat(areaMatch[0]) : 0;
        
        if (area > 0) {
          costPerSqft = Math.round(priceValue / area);
        }
      }
      
      // Add to properties array
      properties.push({
        street: street,
        city: city,
        state: state,
        postal_code: null,
        latitude: null,
        longitude: null,
        cost_per_sqft: costPerSqft,
        zone_name: null,
        permitted_uses: null,
        max_height: null
      });
    }
    
    return properties;
  } catch (error) {
    console.error("Error scraping MagicBricks:", error);
    return [];
  }
}

// Scraper implementation for 99acres
async function scrape99Acres(state: string) {
  try {
    const url = `https://www.99acres.com/search/property/buy/${encodeURIComponent(state.toLowerCase())}?city=${encodeURIComponent(state)}&preference=S&area_unit=1&res_com=R`;
    
    const response = await fetch(url);
    const html = await response.text();
    
    const parser = new DOMParser();
    const document = parser.parseFromString(html, "text/html");
    
    if (!document) {
      throw new Error("Failed to parse HTML document");
    }
    
    const properties = [];
    const propertyCards = document.querySelectorAll(".projectTuple");
    
    for (let i = 0; i < Math.min(propertyCards.length, 10); i++) {
      const card = propertyCards[i];
      
      // Extract location
      const locationElem = card.querySelector(".tuple_address");
      const locationText = locationElem ? locationElem.textContent.trim() : "";
      
      // Extract price
      const priceElem = card.querySelector(".configurationCards__configurationCardsPrice");
      const priceText = priceElem ? priceElem.textContent.trim() : "";
      
      // Extract area
      const areaElem = card.querySelector(".configurationCards__configurationCardsAreaValue");
      const areaText = areaElem ? areaElem.textContent.trim() : "";
      
      // Parse location
      const locationParts = locationText.split(',').map(part => part.trim());
      const city = locationParts.length > 1 ? locationParts[locationParts.length - 2] : state;
      const street = locationParts.length > 0 ? locationParts[0] : "";
      
      // Calculate cost per sqft
      let costPerSqft = null;
      if (priceText && areaText) {
        // Parse price (format: "₹ XX.XX L - ₹ YY.YY L")
        const priceMatch = priceText.match(/₹\s*(\d+(\.\d+)?)\s*L/);
        const priceValue = priceMatch ? parseFloat(priceMatch[1]) * 100000 : 0;
        
        // Parse area
        const areaMatch = areaText.match(/(\d+(\.\d+)?)/);
        const area = areaMatch ? parseFloat(areaMatch[1]) : 0;
        
        if (area > 0) {
          costPerSqft = Math.round(priceValue / area);
        }
      }
      
      properties.push({
        street: street,
        city: city,
        state: state,
        postal_code: null,
        latitude: null,
        longitude: null,
        cost_per_sqft: costPerSqft,
        zone_name: null,
        permitted_uses: null,
        max_height: null
      });
    }
    
    return properties;
  } catch (error) {
    console.error("Error scraping 99acres:", error);
    return [];
  }
}

// Scraper implementation for Housing.com
async function scrapeHousing(state: string) {
  try {
    const url = `https://housing.com/in/buy/searches/${encodeURIComponent(state.toLowerCase())}`;
    
    const response = await fetch(url);
    const html = await response.text();
    
    const parser = new DOMParser();
    const document = parser.parseFromString(html, "text/html");
    
    if (!document) {
      throw new Error("Failed to parse HTML document");
    }
    
    const properties = [];
    const propertyCards = document.querySelectorAll(".css-18rodr0");
    
    for (let i = 0; i < Math.min(propertyCards.length, 10); i++) {
      const card = propertyCards[i];
      
      // Extract location
      const locationElem = card.querySelector(".css-17oe3me");
      const locationText = locationElem ? locationElem.textContent.trim() : "";
      
      // Extract price
      const priceElem = card.querySelector(".css-10b0w9d");
      const priceText = priceElem ? priceElem.textContent.trim() : "";
      
      // Extract area
      const areaElem = card.querySelector(".css-1hj65fu");
      const areaText = areaElem ? areaElem.textContent.trim() : "";
      
      // Parse location
      const locationParts = locationText.split(',').map(part => part.trim());
      const city = locationParts.length > 1 ? locationParts[locationParts.length - 1] : state;
      const street = locationParts.length > 0 ? locationParts[0] : "";
      
      // Calculate cost per sqft
      let costPerSqft = null;
      if (priceText && areaText) {
        // Parse price (format: "₹XX.XX L")
        const priceMatch = priceText.match(/₹\s*(\d+(\.\d+)?)\s*L/);
        const priceValue = priceMatch ? parseFloat(priceMatch[1]) * 100000 : 0;
        
        // Parse area (format: "XXX sq.ft.")
        const areaMatch = areaText.match(/(\d+(\.\d+)?)/);
        const area = areaMatch ? parseFloat(areaMatch[1]) : 0;
        
        if (area > 0) {
          costPerSqft = Math.round(priceValue / area);
        }
      }
      
      properties.push({
        street: street,
        city: city,
        state: state,
        postal_code: null,
        latitude: null,
        longitude: null,
        cost_per_sqft: costPerSqft,
        zone_name: null,
        permitted_uses: null,
        max_height: null
      });
    }
    
    return properties;
  } catch (error) {
    console.error("Error scraping Housing:", error);
    return [];
  }
}
