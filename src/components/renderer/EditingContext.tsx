/**
 * EditingContext — provides `isEditing` state to the entire module subtree
 * without requiring each component to accept it as an explicit prop.
 *
 * Usage in a module component:
 *   const isEditing = useEditing()
 *
 * All modules still accept an optional `isEditing` prop (backward compat).
 * The context is the preferred pattern for new V3 modules.
 */
import { createContext, useContext } from 'react'

const EditingContext = createContext<boolean>(false)

export const EditingProvider = EditingContext.Provider

export function useEditing(): boolean {
  return useContext(EditingContext)
}
