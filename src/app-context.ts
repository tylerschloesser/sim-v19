import { StateObservable } from '@react-rxjs/core'
import React from 'react'

export interface AppContext {
  selectedEntityId$: StateObservable<string | null>
}

export const AppContext = React.createContext<AppContext>(
  null!,
)
