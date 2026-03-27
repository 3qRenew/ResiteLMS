import type { ComponentType } from 'react'
import type { Module } from './index'

// ── ModuleProps ───────────────────────────────────────────────────────────────
// The public prop contract every module component must satisfy.

export type ModuleProps = {
  module: Module
  /** True when rendered inside the Editor (not preview / public view). */
  isEditing?: boolean
}

// ── ModuleDefinition<T> ───────────────────────────────────────────────────────
// Describes a single module type end-to-end.
// T = the normalized (typed) data shape after parsing raw JSON.

export interface ModuleDefinition<T extends Record<string, unknown>> {
  /** The string key stored in `module.module_type` in the database. */
  type: string

  /**
   * Parse raw `module.data` (Record<string, unknown>) into T.
   * Must be safe: never throw, always return a valid T.
   */
  normalize: (raw: Record<string, unknown>) => T

  /** Default data object used when creating a new module of this type. */
  defaultData: T

  /** The React component that renders the module. */
  Component: ComponentType<ModuleProps>
}
