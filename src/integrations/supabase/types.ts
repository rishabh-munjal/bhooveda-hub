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
          zoning_id: number | null
        }
        Insert: {
          address_id?: number
          city?: string | null
          latitude?: number | null
          longitude?: number | null
          postal_code?: string | null
          state?: string | null
          street?: string | null
          zoning_id?: number | null
        }
        Update: {
          address_id?: number
          city?: string | null
          latitude?: number | null
          longitude?: number | null
          postal_code?: string | null
          state?: string | null
          street?: string | null
          zoning_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "addresses_zoning_id_fkey"
            columns: ["zoning_id"]
            isOneToOne: false
            referencedRelation: "zoning_info"
            referencedColumns: ["zoning_id"]
          },
        ]
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
