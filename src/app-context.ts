import { StateObservable } from '@react-rxjs/core'
import React from 'react'
import { State } from './state'
import { Vec2 } from './vec2'

export interface AppContext {
  selectedEntityId$: StateObservable<string | null>

  cursor$: StateObservable<Vec2>
  cursorSize$: StateObservable<number>

  camera$: StateObservable<Vec2>
  viewport$: StateObservable<Vec2>
  scale$: StateObservable<number>

  updateState(fn: (draft: State) => void): void
}

export const AppContext = React.createContext<AppContext>(
  null!,
)
