export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  graphql_public: {
    Tables: Record<never, never>;
    Views: Record<never, never>;
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
  public: {
    Tables: {
      decks: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          name: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          name: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          name?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      fiszki: {
        Row: {
          created_at: string;
          deck_id: string | null;
          id: string;
          metadane: Json | null;
          przod: string;
          status: string;
          tyl: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          deck_id?: string | null;
          id?: string;
          metadane?: Json | null;
          przod: string;
          status: string;
          tyl: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string;
          deck_id?: string | null;
          id?: string;
          metadane?: Json | null;
          przod?: string;
          status?: string;
          tyl?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "fiszki_deck_id_fkey";
            columns: ["deck_id"];
            isOneToOne: false;
            referencedRelation: "decks";
            referencedColumns: ["id"];
          },
        ];
      };
      fiszki_history: {
        Row: {
          edited_at: string;
          fiszka_id: string;
          history_id: string;
          metadane: Json | null;
          przod: string;
          status: string;
          tyl: string;
          user_id: string;
          version_number: number;
        };
        Insert: {
          edited_at?: string;
          fiszka_id: string;
          history_id?: string;
          metadane?: Json | null;
          przod: string;
          status: string;
          tyl: string;
          user_id: string;
          version_number: number;
        };
        Update: {
          edited_at?: string;
          fiszka_id?: string;
          history_id?: string;
          metadane?: Json | null;
          przod?: string;
          status?: string;
          tyl?: string;
          user_id?: string;
          version_number?: number;
        };
        Relationships: [
          {
            foreignKeyName: "fiszki_history_fiszka_id_fkey";
            columns: ["fiszka_id"];
            isOneToOne: false;
            referencedRelation: "fiszki";
            referencedColumns: ["id"];
          },
        ];
      };
      fiszki_logs: {
        Row: {
          action: string;
          details: Json | null;
          fiszka_id: string;
          log_id: string;
          log_timestamp: string;
          user_id: string;
        };
        Insert: {
          action: string;
          details?: Json | null;
          fiszka_id: string;
          log_id?: string;
          log_timestamp?: string;
          user_id: string;
        };
        Update: {
          action?: string;
          details?: Json | null;
          fiszka_id?: string;
          log_id?: string;
          log_timestamp?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "fiszki_logs_fiszka_id_fkey";
            columns: ["fiszka_id"];
            isOneToOne: false;
            referencedRelation: "fiszki";
            referencedColumns: ["id"];
          },
        ];
      };
      user_profiles: {
        Row: {
          created_at: string;
          id: string;
          role: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string;
          id: string;
          role?: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<never, never>;
    Functions: Record<never, never>;
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const;
