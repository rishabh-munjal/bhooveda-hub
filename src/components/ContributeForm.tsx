import { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Building, MapPin, Check } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define the form schema with Zod
const formSchema = z.object({
  street: z.string().min(3, "Street must be at least 3 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  postal_code: z.string().min(5, "Postal code must be at least 5 characters"),
  zone_name: z.string().optional(),
  max_building_height: z.coerce.number().optional(),
  estimated_cost_per_sqft: z.coerce.number().min(1, "Cost must be greater than 0").optional(),
  restriction_type: z.string().optional(),
  restriction_value: z.string().optional(),
  notes: z.string().optional(),
  data_source: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const ContributeForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      street: "",
      city: "",
      state: "",
      postal_code: "",
      zone_name: "",
      max_building_height: undefined,
      estimated_cost_per_sqft: undefined,
      restriction_type: "",
      restriction_value: "",
      notes: "",
      data_source: "User Contribution",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      console.log("Submitting form with values:", values);

      // First, insert the address
      const { data: addressData, error: addressError } = await supabase
        .from('addresses')
        .insert({
          street: values.street,
          city: values.city,
          state: values.state,
          postal_code: values.postal_code,
        })
        .select('address_id');

      if (addressError) {
        throw addressError;
      }

      const addressId = addressData[0].address_id;
      console.log("Created address with ID:", addressId);

      // Insert zoning info if provided
      if (values.zone_name) {
        const { data: zoningData, error: zoningError } = await supabase
          .from('zoning_info')
          .insert({
            zone_name: values.zone_name,
            max_building_height: values.max_building_height,
          })
          .select('zoning_id');

        if (zoningError) {
          console.error("Error inserting zoning info:", zoningError);
        } else {
          // Update address with zoning ID
          const zoningId = zoningData[0].zoning_id;
          await supabase
            .from('addresses')
            .update({ zoning_id: zoningId })
            .eq('address_id', addressId);
        }
      }

      // Insert building restriction if provided
      if (values.restriction_type && values.restriction_value) {
        const { error: restrictionError } = await supabase
          .from('building_restrictions')
          .insert({
            address_id: addressId,
            restriction_type: values.restriction_type,
            restriction_value: values.restriction_value,
            notes: values.notes,
          });

        if (restrictionError) {
          console.error("Error inserting building restriction:", restrictionError);
        }
      }

      // Insert land cost if provided
      if (values.estimated_cost_per_sqft) {
        const { error: costError } = await supabase
          .from('land_costs')
          .insert({
            address_id: addressId,
            estimated_cost_per_sqft: values.estimated_cost_per_sqft,
            date_of_estimation: new Date().toISOString().split('T')[0],
            data_source: values.data_source,
          });

        if (costError) {
          console.error("Error inserting land cost:", costError);
        }
      }

      // Show success state
      setIsSuccess(true);
      
      toast({
        title: "Contribution submitted successfully",
        description: "Thank you for contributing property data!",
        variant: "default",
      });

      // Reset form after 3 seconds
      setTimeout(() => {
        form.reset();
        setIsSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error submitting contribution",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      {isSuccess ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Thank You!</h2>
          <p className="text-gray-600 max-w-md mb-6">
            Your contribution has been successfully submitted. Your data will help improve property information for everyone.
          </p>
          <Button 
            onClick={() => {
              form.reset();
              setIsSuccess(false);
            }}
            variant="outline"
          >
            Submit Another Contribution
          </Button>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
              <Building className="h-6 w-6 text-primary" />
              Contribute Property Data
            </h2>
            <p className="text-gray-600 mt-1">
              Help improve our database by contributing information about properties in your area.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
                <h3 className="text-md font-medium text-gray-800 mb-3 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  Property Location
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="street"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address*</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main St" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City*</FormLabel>
                        <FormControl>
                          <Input placeholder="Mumbai" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State*</FormLabel>
                        <FormControl>
                          <Input placeholder="Maharashtra" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="postal_code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal Code*</FormLabel>
                        <FormControl>
                          <Input placeholder="400001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
                <h3 className="text-md font-medium text-gray-800 mb-3">Zoning Information (Optional)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="zone_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Zone Type</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select zone type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Residential">Residential</SelectItem>
                              <SelectItem value="Commercial">Commercial</SelectItem>
                              <SelectItem value="Industrial">Industrial</SelectItem>
                              <SelectItem value="Mixed-use">Mixed-use</SelectItem>
                              <SelectItem value="Agricultural">Agricultural</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="max_building_height"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Building Height (meters)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="30" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
                <h3 className="text-md font-medium text-gray-800 mb-3">Building Restrictions (Optional)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="restriction_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Restriction Type</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select restriction type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Height Restriction">Height Restriction</SelectItem>
                              <SelectItem value="FAR Limitation">FAR Limitation</SelectItem>
                              <SelectItem value="Setback Requirement">Setback Requirement</SelectItem>
                              <SelectItem value="Green Area Requirement">Green Area Requirement</SelectItem>
                              <SelectItem value="Basement Allowance">Basement Allowance</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="restriction_value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Restriction Value</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. '45 meters' or '3.5'" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Additional details about the restriction"
                            className="resize-none h-20"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
                <h3 className="text-md font-medium text-gray-800 mb-3">Land Cost Information (Optional)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="estimated_cost_per_sqft"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estimated Cost per sqft (₹)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="10000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="data_source"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data Source</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Local Broker, News Source" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-center">
                <Button 
                  type="submit" 
                  className="w-full md:w-auto px-8" 
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Contribution"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </>
      )}
    </div>
  );
};

export default ContributeForm;
