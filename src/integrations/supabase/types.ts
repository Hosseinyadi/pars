export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      ads: {
        Row: {
          ad_type: string
          brand: string | null
          category_id: string | null
          city_id: string | null
          condition: string | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string
          description: string | null
          expires_at: string | null
          hours: number | null
          id: string
          images: string[] | null
          is_active: boolean | null
          is_approved: boolean | null
          is_featured: boolean | null
          model: string | null
          price: number | null
          province_id: string | null
          title: string
          updated_at: string
          user_id: string | null
          view_count: number | null
          year: number | null
        }
        Insert: {
          ad_type: string
          brand?: string | null
          category_id?: string | null
          city_id?: string | null
          condition?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          expires_at?: string | null
          hours?: number | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          is_approved?: boolean | null
          is_featured?: boolean | null
          model?: string | null
          price?: number | null
          province_id?: string | null
          title: string
          updated_at?: string
          user_id?: string | null
          view_count?: number | null
          year?: number | null
        }
        Update: {
          ad_type?: string
          brand?: string | null
          category_id?: string | null
          city_id?: string | null
          condition?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          expires_at?: string | null
          hours?: number | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          is_approved?: boolean | null
          is_featured?: boolean | null
          model?: string | null
          price?: number | null
          province_id?: string | null
          title?: string
          updated_at?: string
          user_id?: string | null
          view_count?: number | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ads_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ads_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ads_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          name_en: string | null
          sort_order: number | null
        }
        Insert: {
          created_at?: string
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          name_en?: string | null
          sort_order?: number | null
        }
        Update: {
          created_at?: string
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          name_en?: string | null
          sort_order?: number | null
        }
        Relationships: []
      }
      cities: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          name: string
          name_en: string | null
          province_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          name: string
          name_en?: string | null
          province_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          name?: string
          name_en?: string | null
          province_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cities_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
        ]
      }
      discount_codes: {
        Row: {
          code: string
          created_at: string
          discount_amount: number | null
          discount_percent: number | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          max_uses: number | null
          used_count: number | null
        }
        Insert: {
          code: string
          created_at?: string
          discount_amount?: number | null
          discount_percent?: number | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          used_count?: number | null
        }
        Update: {
          code?: string
          created_at?: string
          discount_amount?: number | null
          discount_percent?: number | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          used_count?: number | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          ad_id: string | null
          amount: number
          created_at: string
          discount_code_id: string | null
          id: string
          payment_method: string | null
          status: string | null
          transaction_id: string | null
          user_id: string | null
        }
        Insert: {
          ad_id?: string | null
          amount: number
          created_at?: string
          discount_code_id?: string | null
          id?: string
          payment_method?: string | null
          status?: string | null
          transaction_id?: string | null
          user_id?: string | null
        }
        Update: {
          ad_id?: string | null
          amount?: number
          created_at?: string
          discount_code_id?: string | null
          id?: string
          payment_method?: string | null
          status?: string | null
          transaction_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_ad_id_fkey"
            columns: ["ad_id"]
            isOneToOne: false
            referencedRelation: "ads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_discount_code_id_fkey"
            columns: ["discount_code_id"]
            isOneToOne: false
            referencedRelation: "discount_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing: {
        Row: {
          ad_type: string
          created_at: string
          duration_days: number
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          name: string
          price: number
        }
        Insert: {
          ad_type: string
          created_at?: string
          duration_days: number
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          name: string
          price: number
        }
        Update: {
          ad_type?: string
          created_at?: string
          duration_days?: number
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          name?: string
          price?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          city: string | null
          created_at: string
          first_name: string | null
          id: string
          is_verified: boolean | null
          last_name: string | null
          phone: string | null
          province: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          city?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          is_verified?: boolean | null
          last_name?: string | null
          phone?: string | null
          province?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          city?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          is_verified?: boolean | null
          last_name?: string | null
          phone?: string | null
          province?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      provinces: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          name: string
          name_en: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          name: string
          name_en?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          name?: string
          name_en?: string | null
        }
        Relationships: []
      }
      settings: {
        Row: {
          id: string
          key: string
          updated_at: string
          value: Json | null
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string
          value?: Json | null
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string
          value?: Json | null
        }
        Relationships: []
      }
      sms_codes: {
        Row: {
          code: string
          created_at: string
          expires_at: string
          id: string
          phone: string
          type: string
          used: boolean | null
        }
        Insert: {
          code: string
          created_at?: string
          expires_at: string
          id?: string
          phone: string
          type: string
          used?: boolean | null
        }
        Update: {
          code?: string
          created_at?: string
          expires_at?: string
          id?: string
          phone?: string
          type?: string
          used?: boolean | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string | null
        }
        Insert: {
          assigned_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string | null
        }
        Update: {
          assigned_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: { user_uuid?: string }
        Returns: boolean
      }
    }
    Enums: {
      user_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["admin", "moderator", "user"],
    },
  },
} as const
