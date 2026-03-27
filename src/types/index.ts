// ============================================================
// Resite Platform — Core Data Types
// Schema hierarchy: Page > Section > Module > Element
// All content is JSON Schema driven — no hardcoded HTML.
// ============================================================

export interface Element {
  id: string;
  type: string;
  data: Record<string, unknown>;
}

export interface Module {
  id: string;
  section_id: string;
  /** Maps to a component in src/components/modules/ */
  module_type: string;
  order: number;
  /** Freeform JSON payload consumed by the module component */
  data: Record<string, unknown>;
  elements?: Element[];
  created_at?: string;
  updated_at?: string;
}

export interface Section {
  id: string;
  page_id: string;
  title?: string;
  order: number;
  modules: Module[];
  created_at?: string;
  updated_at?: string;
}

export interface Page {
  id: string;
  project_id: string;
  title: string;
  slug: string;
  sections: Section[];
  /** SEO / Open Graph metadata */
  meta?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  pages?: Page[];
  created_at?: string;
  updated_at?: string;
}

export type { SiteSharedInfo, SiteSharedSocialLink } from './siteSharedInfo'
