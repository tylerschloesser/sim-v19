import { StateObservable } from '@react-rxjs/core'
import React from 'react'
import { Vec2 } from './vec2'

export interface AppContext {
  selectedEntityId$: StateObservable<string | null>

  camera$: StateObservable<Vec2>
  viewport$: StateObservable<Vec2>
  scale$: StateObservable<number>
}

export const AppContext = React.createContext<AppContext>(
  null!,
)
