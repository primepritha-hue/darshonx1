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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      chat_usage: {
        Row: {
          count: number
          id: string
          used_at: string
          visitor_id: string
        }
        Insert: {
          count?: number
          id?: string
          used_at?: string
          visitor_id: string
        }
        Update: {
          count?: number
          id?: string
          used_at?: string
          visitor_id?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string
          description: string | null
          github_url: string | null
          id: string
          live_url: string | null
          sort_order: number
          tags: string[] | null
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          github_url?: string | null
          id?: string
          live_url?: string | null
          sort_order?: number
          tags?: string[] | null
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          github_url?: string | null
          id?: string
          live_url?: string | null
          sort_order?: number
          tags?: string[] | null
          title?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          about_features: Json
          about_heading: string
          ai_prompt: string
          bio: string | null
          brand_name: string
          chatbot_api_provider: string
          chatbot_name: string
          contact_intro: string
          discord_avatar_url: string | null
          discord_badges: string[] | null
          discord_status: string | null
          discord_username: string | null
          email: string | null
          footer_text: string
          general_chat_daily_limit: number
          github_url: string | null
          hero_tagline: string
          id: string
          linkedin_url: string | null
          location: string | null
          name: string
          phone: string | null
          show_discord_profile: boolean | null
          title: string
          updated_at: string
        }
        Insert: {
          about_features?: Json
          about_heading?: string
          ai_prompt?: string
          bio?: string | null
          brand_name?: string
          chatbot_api_provider?: string
          chatbot_name?: string
          contact_intro?: string
          discord_avatar_url?: string | null
          discord_badges?: string[] | null
          discord_status?: string | null
          discord_username?: string | null
          email?: string | null
          footer_text?: string
          general_chat_daily_limit?: number
          github_url?: string | null
          hero_tagline?: string
          id?: string
          linkedin_url?: string | null
          location?: string | null
          name?: string
          phone?: string | null
          show_discord_profile?: boolean | null
          title?: string
          updated_at?: string
        }
        Update: {
          about_features?: Json
          about_heading?: string
          ai_prompt?: string
          bio?: string | null
          brand_name?: string
          chatbot_api_provider?: string
          chatbot_name?: string
          contact_intro?: string
          discord_avatar_url?: string | null
          discord_badges?: string[] | null
          discord_status?: string | null
          discord_username?: string | null
          email?: string | null
          footer_text?: string
          general_chat_daily_limit?: number
          github_url?: string | null
          hero_tagline?: string
          id?: string
          linkedin_url?: string | null
          location?: string | null
          name?: string
          phone?: string | null
          show_discord_profile?: boolean | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      skills: {
        Row: {
          created_at: string
          id: string
          level: number
          name: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          level?: number
          name: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          id?: string
          level?: number
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      social_links: {
        Row: {
          created_at: string
          icon: string
          id: string
          is_active: boolean
          name: string
          sort_order: number
          url: string
        }
        Insert: {
          created_at?: string
          icon?: string
          id?: string
          is_active?: boolean
          name: string
          sort_order?: number
          url: string
        }
        Update: {
          created_at?: string
          icon?: string
          id?: string
          is_active?: boolean
          name?: string
          sort_order?: number
          url?: string
        }
        Relationships: []
      }
      tools: {
        Row: {
          allow_download: boolean
          created_at: string
          description: string
          file_name: string | null
          file_url: string | null
          icon: string
          id: string
          is_active: boolean
          name: string
          slug: string | null
          sort_order: number
          type: string
        }
        Insert: {
          allow_download?: boolean
          created_at?: string
          description?: string
          file_name?: string | null
          file_url?: string | null
          icon?: string
          id?: string
          is_active?: boolean
          name: string
          slug?: string | null
          sort_order?: number
          type?: string
        }
        Update: {
          allow_download?: boolean
          created_at?: string
          description?: string
          file_name?: string | null
          file_url?: string | null
          icon?: string
          id?: string
          is_active?: boolean
          name?: string
          slug?: string | null
          sort_order?: number
          type?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
