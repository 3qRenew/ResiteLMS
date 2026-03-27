import { createClient } from '@supabase/supabase-js';
import type { Section, Module, SiteSharedInfo } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase env vars. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env'
  );
}

// Minimal hand-written Database type that satisfies supabase-js v2 GenericSchema contract.
// Shape mirrors Supabase CLI-generated output:
//   • Row/Insert/Update use inline object types (interfaces don't satisfy Record<string,unknown>)
//   • Relationships: []  (not never[])
//   • Views/Functions: { [_ in never]: never }  (empty mapped type, not Record<string, never>)
// TODO: replace with `supabase gen types typescript` output once Supabase CLI access is available.

export type Database = {
  public: {
    Tables: {
      projects: {
        Row:    { id: string; name: string; slug: string; project_data: { sections: Section[]; siteInfo?: Partial<SiteSharedInfo> }; thumbnail_url: string | null; description?: string; created_at?: string; updated_at?: string }
        Insert: { id?: string; name: string; slug: string; project_data: { sections: Section[]; siteInfo?: Partial<SiteSharedInfo> }; thumbnail_url?: string | null; updated_at?: string }
        Update: { id?: string; name?: string; slug?: string; project_data?: { sections: Section[]; siteInfo?: Partial<SiteSharedInfo> }; thumbnail_url?: string | null; updated_at?: string }
        Relationships: []
      }
      pages: {
        Row:    { id: string; project_id: string; title: string; slug: string; sections: Section[]; meta?: Record<string, unknown>; created_at?: string; updated_at?: string }
        Insert: { id?: string; project_id: string; title: string; slug: string; sections?: Section[] }
        Update: { id?: string; project_id?: string; title?: string; slug?: string; sections?: Section[] }
        Relationships: []
      }
      sections: {
        Row:    { id: string; page_id: string; title?: string; order: number; modules: Module[]; created_at?: string; updated_at?: string }
        Insert: { id?: string; page_id: string; title?: string; order: number; modules?: Module[] }
        Update: { id?: string; page_id?: string; title?: string; order?: number; modules?: Module[] }
        Relationships: []
      }
      modules: {
        Row:    { id: string; section_id: string; module_type: string; order: number; data: Record<string, unknown>; created_at?: string; updated_at?: string }
        Insert: { id?: string; section_id: string; module_type: string; order: number; data?: Record<string, unknown> }
        Update: { id?: string; section_id?: string; module_type?: string; order?: number; data?: Record<string, unknown> }
        Relationships: []
      }
      leads: {
        Row:    { id?: string; name: string; phone: string; email: string; project_id: string | null; created_at?: string }
        Insert: { name: string; phone: string; email: string; project_id: string | null }
        Update: { name?: string; phone?: string; email?: string; project_id?: string | null }
        Relationships: []
      }
    }
    Views:     { [_ in never]: never }
    Functions: { [_ in never]: never }
  }
};

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
