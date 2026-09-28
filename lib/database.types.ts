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
      application_log: {
        Row: {
          clicked_at: string | null
          id: string
          opportunity_id: string | null
          user_id: string | null
        }
        Insert: {
          clicked_at?: string | null
          id?: string
          opportunity_id?: string | null
          user_id?: string | null
        }
        Update: {
          clicked_at?: string | null
          id?: string
          opportunity_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "application_log_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "application_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          metadata: Json
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          metadata?: Json
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          metadata?: Json
        }
        Relationships: []
      }
      bookmarks: {
        Row: {
          created_at: string | null
          opportunity_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          opportunity_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          opportunity_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookmarks_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookmarks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ingested_items_raw: {
        Row: {
          created_at: string
          error_message: string | null
          external_id: string | null
          id: string
          payload_hash: string
          processed_at: string | null
          processing_status: string
          raw_payload: Json
          source_id: string | null
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          external_id?: string | null
          id?: string
          payload_hash: string
          processed_at?: string | null
          processing_status?: string
          raw_payload: Json
          source_id?: string | null
        }
        Update: {
          created_at?: string
          error_message?: string | null
          external_id?: string | null
          id?: string
          payload_hash?: string
          processed_at?: string | null
          processing_status?: string
          raw_payload?: Json
          source_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ingested_items_raw_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "opportunity_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      interests: {
        Row: {
          category: string | null
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      opportunities: {
        Row: {
          application_url: string
          canonical_url: string | null
          category: string
          created_at: string | null
          currency: string | null
          deadline: string | null
          deduplication_hash: string | null
          description: string
          duration: string | null
          education_level: string | null
          eligibility_text: string | null
          embedding: string | null
          experience_level: string | null
          id: string
          is_featured: boolean | null
          is_verified: boolean | null
          location: string | null
          logo_url: string | null
          max_year: number | null
          min_year: number | null
          mode: string | null
          moderation_reason: string | null
          opportunity_type: string | null
          organization: string
          organization_website: string | null
          price: number | null
          pricing_type: string | null
          prize_pool_max: number | null
          prize_pool_min: number | null
          skills: string[] | null
          slug: string | null
          source_id: string | null
          source_url: string | null
          start_date: string | null
          status: string | null
          stipend_max: number | null
          stipend_min: number | null
          subcategory: string | null
          submitted_by: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          application_url: string
          canonical_url?: string | null
          category: string
          created_at?: string | null
          currency?: string | null
          deadline?: string | null
          deduplication_hash?: string | null
          description: string
          duration?: string | null
          education_level?: string | null
          eligibility_text?: string | null
          embedding?: string | null
          experience_level?: string | null
          id?: string
          is_featured?: boolean | null
          is_verified?: boolean | null
          location?: string | null
          logo_url?: string | null
          max_year?: number | null
          min_year?: number | null
          mode?: string | null
          moderation_reason?: string | null
          opportunity_type?: string | null
          organization: string
          organization_website?: string | null
          price?: number | null
          pricing_type?: string | null
          prize_pool_max?: number | null
          prize_pool_min?: number | null
          skills?: string[] | null
          slug?: string | null
          source_id?: string | null
          source_url?: string | null
          start_date?: string | null
          status?: string | null
          stipend_max?: number | null
          stipend_min?: number | null
          subcategory?: string | null
          submitted_by?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          application_url?: string
          canonical_url?: string | null
          category?: string
          created_at?: string | null
          currency?: string | null
          deadline?: string | null
          deduplication_hash?: string | null
          description?: string
          duration?: string | null
          education_level?: string | null
          eligibility_text?: string | null
          embedding?: string | null
          experience_level?: string | null
          id?: string
          is_featured?: boolean | null
          is_verified?: boolean | null
          location?: string | null
          logo_url?: string | null
          max_year?: number | null
          min_year?: number | null
          mode?: string | null
          moderation_reason?: string | null
          opportunity_type?: string | null
          organization?: string
          organization_website?: string | null
          price?: number | null
          pricing_type?: string | null
          prize_pool_max?: number | null
          prize_pool_min?: number | null
          skills?: string[] | null
          slug?: string | null
          source_id?: string | null
          source_url?: string | null
          start_date?: string | null
          status?: string | null
          stipend_max?: number | null
          stipend_min?: number | null
          subcategory?: string | null
          submitted_by?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "opportunities_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "opportunity_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunity_categories: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
        }
        Relationships: []
      }
      opportunity_reminders: {
        Row: {
          channel: string
          created_at: string
          id: string
          opportunity_id: string
          remind_at: string
          sent_at: string | null
          status: string
          user_id: string
        }
        Insert: {
          channel?: string
          created_at?: string
          id?: string
          opportunity_id: string
          remind_at: string
          sent_at?: string | null
          status?: string
          user_id: string
        }
        Update: {
          channel?: string
          created_at?: string
          id?: string
          opportunity_id?: string
          remind_at?: string
          sent_at?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "opportunity_reminders_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunity_reminders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunity_sources: {
        Row: {
          adapter_type: string
          created_at: string
          enabled: boolean
          error_count: number
          feed_url: string
          id: string
          last_error: string | null
          last_fetched_at: string | null
          name: string
          trust_score: number
          updated_at: string
        }
        Insert: {
          adapter_type: string
          created_at?: string
          enabled?: boolean
          error_count?: number
          feed_url: string
          id?: string
          last_error?: string | null
          last_fetched_at?: string | null
          name: string
          trust_score?: number
          updated_at?: string
        }
        Update: {
          adapter_type?: string
          created_at?: string
          enabled?: boolean
          error_count?: number
          feed_url?: string
          id?: string
          last_error?: string | null
          last_fetched_at?: string | null
          name?: string
          trust_score?: number
          updated_at?: string
        }
        Relationships: []
      }
      organizer_profiles: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          organization_name: string
          organization_type: string | null
          updated_at: string | null
          verified: boolean | null
          website: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id: string
          organization_name: string
          organization_type?: string | null
          updated_at?: string | null
          verified?: boolean | null
          website?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          organization_name?: string
          organization_type?: string | null
          updated_at?: string | null
          verified?: boolean | null
          website?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          branch: string | null
          career_interests: string[]
          cgpa: number | null
          college: string | null
          created_at: string | null
          current_year: number | null
          degree: string | null
          email: string | null
          email_notifications_enabled: boolean | null
          experience_level: string | null
          full_name: string | null
          github_url: string | null
          graduation_year: number | null
          id: string
          is_profile_complete: boolean | null
          linkedin_url: string | null
          location: string | null
          phone: string | null
          portfolio_url: string | null
          preferred_categories: string[]
          preferred_locations: string[]
          preferred_modes: string[]
          profile_completion_pct: number | null
          profile_public: boolean
          reminders_enabled: boolean | null
          resume_reference: string | null
          role: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          branch?: string | null
          career_interests?: string[]
          cgpa?: number | null
          college?: string | null
          created_at?: string | null
          current_year?: number | null
          degree?: string | null
          email?: string | null
          email_notifications_enabled?: boolean | null
          experience_level?: string | null
          full_name?: string | null
          github_url?: string | null
          graduation_year?: number | null
          id: string
          is_profile_complete?: boolean | null
          linkedin_url?: string | null
          location?: string | null
          phone?: string | null
          portfolio_url?: string | null
          preferred_categories?: string[]
          preferred_locations?: string[]
          preferred_modes?: string[]
          profile_completion_pct?: number | null
          profile_public?: boolean
          reminders_enabled?: boolean | null
          resume_reference?: string | null
          role?: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          branch?: string | null
          career_interests?: string[]
          cgpa?: number | null
          college?: string | null
          created_at?: string | null
          current_year?: number | null
          degree?: string | null
          email?: string | null
          email_notifications_enabled?: boolean | null
          experience_level?: string | null
          full_name?: string | null
          github_url?: string | null
          graduation_year?: number | null
          id?: string
          is_profile_complete?: boolean | null
          linkedin_url?: string | null
          location?: string | null
          phone?: string | null
          portfolio_url?: string | null
          preferred_categories?: string[]
          preferred_locations?: string[]
          preferred_modes?: string[]
          profile_completion_pct?: number | null
          profile_public?: boolean
          reminders_enabled?: boolean | null
          resume_reference?: string | null
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      recommendations: {
        Row: {
          generated_at: string | null
          id: string
          interest_score: number | null
          match_reasons: string[] | null
          matched_skills: string[] | null
          missing_skills: string[] | null
          opportunity_id: string | null
          score: number | null
          semantic_score: number | null
          skill_score: number | null
          user_id: string | null
        }
        Insert: {
          generated_at?: string | null
          id?: string
          interest_score?: number | null
          match_reasons?: string[] | null
          matched_skills?: string[] | null
          missing_skills?: string[] | null
          opportunity_id?: string | null
          score?: number | null
          semantic_score?: number | null
          skill_score?: number | null
          user_id?: string | null
        }
        Update: {
          generated_at?: string | null
          id?: string
          interest_score?: number | null
          match_reasons?: string[] | null
          matched_skills?: string[] | null
          missing_skills?: string[] | null
          opportunity_id?: string | null
          score?: number | null
          semantic_score?: number | null
          skill_score?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recommendations_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recommendations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          created_at: string
          details: string | null
          id: string
          opportunity_id: string
          reason: string
          reporter_id: string
          resolved_at: string | null
          resolved_by: string | null
          status: string
        }
        Insert: {
          created_at?: string
          details?: string | null
          id?: string
          opportunity_id: string
          reason: string
          reporter_id: string
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          details?: string | null
          id?: string
          opportunity_id?: string
          reason?: string
          reporter_id?: string
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_opportunities: {
        Row: {
          created_at: string
          id: string
          note: string | null
          opportunity_id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          note?: string | null
          opportunity_id: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          note?: string | null
          opportunity_id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_opportunities_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_opportunities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      skills: {
        Row: {
          category: string | null
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      user_consents: {
        Row: {
          agreed: boolean
          agreed_at: string
          consent_type: string
          created_at: string
          id: string
          ip_hash: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          agreed?: boolean
          agreed_at?: string
          consent_type: string
          created_at?: string
          id?: string
          ip_hash?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          agreed?: boolean
          agreed_at?: string
          consent_type?: string
          created_at?: string
          id?: string
          ip_hash?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_consents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_interests: {
        Row: {
          interest_id: string
          user_id: string
        }
        Insert: {
          interest_id: string
          user_id: string
        }
        Update: {
          interest_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_interests_interest_id_fkey"
            columns: ["interest_id"]
            isOneToOne: false
            referencedRelation: "interests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_interests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_skills: {
        Row: {
          level: string | null
          skill_id: string
          user_id: string
        }
        Insert: {
          level?: string | null
          skill_id: string
          user_id: string
        }
        Update: {
          level?: string | null
          skill_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_skills_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          assigned_by: string | null
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          assigned_by?: string | null
          created_at?: string
          id?: string
          role: string
          user_id: string
        }
        Update: {
          assigned_by?: string | null
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_rate_limit: {
        Args: { p_key: string; p_limit: number; p_window_seconds: number }
        Returns: boolean
      }
      delete_my_account: { Args: { p_user_id: string }; Returns: boolean }
      hybrid_search: {
        Args: {
          filter_category?: string
          match_count?: number
          query_embedding: string
          search_text: string
        }
        Returns: {
          application_url: string
          category: string
          deadline: string
          id: string
          mode: string
          organization: string
          pricing_type: string
          prize_pool_max: number
          rank: number
          skills: string[]
          stipend_max: number
          stipend_min: number
          title: string
        }[]
      }
      match_opportunities: {
        Args: {
          filter_category?: string
          filter_mode?: string
          match_count?: number
          match_threshold?: number
          query_embedding: string
        }
        Returns: {
          application_url: string
          category: string
          deadline: string
          id: string
          mode: string
          organization: string
          pricing_type: string
          prize_pool_max: number
          similarity: number
          skills: string[]
          stipend_max: number
          stipend_min: number
          title: string
        }[]
      }
      save_profile_taxonomy: {
        Args: { p_interests: string[]; p_skills: string[]; p_user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Opportunity = Database['public']['Tables']['opportunities']['Row']
export type OpportunitySource = Database['public']['Tables']['opportunity_sources']['Row']
export type SavedOpportunity = Database['public']['Tables']['saved_opportunities']['Row']
export type OpportunityReminder = Database['public']['Tables']['opportunity_reminders']['Row']
export type UserConsent = Database['public']['Tables']['user_consents']['Row']
export type Skill = Database['public']['Tables']['skills']['Row']
export type UserSkill = Database['public']['Tables']['user_skills']['Row']
export type AuditLog = Database['public']['Tables']['audit_logs']['Row']
export type Report = Database['public']['Tables']['reports']['Row']
