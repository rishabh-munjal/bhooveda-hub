export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      address_gov_processes: {
        Row: {
          address_id: number | null
          agp_id: number
          date_completed: string | null
          date_initiated: string | null
          process_id: number | null
          status: string | null
        }
        Insert: {
          address_id?: number | null
          agp_id?: number
          date_completed?: string | null
          date_initiated?: string | null
          process_id?: number | null
          status?: string | null
        }
        Update: {
          address_id?: number | null
          agp_id?: number
          date_completed?: string | null
          date_initiated?: string | null
          process_id?: number | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "address_gov_processes_address_id_fkey"
            columns: ["address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["address_id"]
          },
          {
            foreignKeyName: "address_gov_processes_process_id_fkey"
            columns: ["process_id"]
            isOneToOne: false
            referencedRelation: "gov_processes"
            referencedColumns: ["process_id"]
          },
        ]
      }
      addresses: {
        Row: {
          address_id: number
          city: string | null
          latitude: number | null
          longitude: number | null
          postal_code: string | null
          state: string | null
          street: string | null
        }
        Insert: {
          address_id?: number
          city?: string | null
          latitude?: number | null
          longitude?: number | null
          postal_code?: string | null
          state?: string | null
          street?: string | null
        }
        Update: {
          address_id?: number
          city?: string | null
          latitude?: number | null
          longitude?: number | null
          postal_code?: string | null
          state?: string | null
          street?: string | null
        }
        Relationships: []
      }
      building_restrictions: {
        Row: {
          address_id: number | null
          notes: string | null
          restriction_id: number
          restriction_type: string | null
          restriction_value: string | null
        }
        Insert: {
          address_id?: number | null
          notes?: string | null
          restriction_id?: number
          restriction_type?: string | null
          restriction_value?: string | null
        }
        Update: {
          address_id?: number | null
          notes?: string | null
          restriction_id?: number
          restriction_type?: string | null
          restriction_value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "building_restrictions_address_id_fkey"
            columns: ["address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["address_id"]
          },
        ]
      }
      future_price_projections: {
        Row: {
          address_id: number | null
          analysis_details: string | null
          projected_increase_percentage: number | null
          projection_date: string | null
          projection_id: number
        }
        Insert: {
          address_id?: number | null
          analysis_details?: string | null
          projected_increase_percentage?: number | null
          projection_date?: string | null
          projection_id?: number
        }
        Update: {
          address_id?: number | null
          analysis_details?: string | null
          projected_increase_percentage?: number | null
          projection_date?: string | null
          projection_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "future_price_projections_address_id_fkey"
            columns: ["address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["address_id"]
          },
        ]
      }
      gov_processes: {
        Row: {
          description: string | null
          estimated_duration: string | null
          process_id: number
          process_name: string | null
          required_documents: string | null
          steps: string | null
        }
        Insert: {
          description?: string | null
          estimated_duration?: string | null
          process_id?: number
          process_name?: string | null
          required_documents?: string | null
          steps?: string | null
        }
        Update: {
          description?: string | null
          estimated_duration?: string | null
          process_id?: number
          process_name?: string | null
          required_documents?: string | null
          steps?: string | null
        }
        Relationships: []
      }
      land_costs: {
        Row: {
          address_id: number | null
          cost_id: number
          data_source: string | null
          date_of_estimation: string | null
          estimated_cost_per_sqft: number | null
        }
        Insert: {
          address_id?: number | null
          cost_id?: number
          data_source?: string | null
          date_of_estimation?: string | null
          estimated_cost_per_sqft?: number | null
        }
        Update: {
          address_id?: number | null
          cost_id?: number
          data_source?: string | null
          date_of_estimation?: string | null
          estimated_cost_per_sqft?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "land_costs_address_id_fkey"
            columns: ["address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["address_id"]
          },
        ]
      }
      permissions: {
        Row: {
          application_fee: number | null
          description: string | null
          estimated_processing_time: string | null
          issuing_authority: string | null
          permission_id: number
          permission_type: string | null
        }
        Insert: {
          application_fee?: number | null
          description?: string | null
          estimated_processing_time?: string | null
          issuing_authority?: string | null
          permission_id?: number
          permission_type?: string | null
        }
        Update: {
          application_fee?: number | null
          description?: string | null
          estimated_processing_time?: string | null
          issuing_authority?: string | null
          permission_id?: number
          permission_type?: string | null
        }
        Relationships: []
      }
      zoning_info: {
        Row: {
          density_limit: number | null
          effective_date: string | null
          max_building_height: number | null
          min_front_setback: number | null
          min_rear_setback: number | null
          min_side_setback: number | null
          permitted_land_uses: string | null
          restrictions_description: string | null
          zone_name: string | null
          zoning_id: number
        }
        Insert: {
          density_limit?: number | null
          effective_date?: string | null
          max_building_height?: number | null
          min_front_setback?: number | null
          min_rear_setback?: number | null
          min_side_setback?: number | null
          permitted_land_uses?: string | null
          restrictions_description?: string | null
          zone_name?: string | null
          zoning_id?: number
        }
        Update: {
          density_limit?: number | null
          effective_date?: string | null
          max_building_height?: number | null
          min_front_setback?: number | null
          min_rear_setback?: number | null
          min_side_setback?: number | null
          permitted_land_uses?: string | null
          restrictions_description?: string | null
          zone_name?: string | null
          zoning_id?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
