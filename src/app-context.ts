import { StateObservable } from '@react-rxjs/core'
import React from 'react'
import { CursorAction } from './cursor-action'
import { State } from './state'
import { Vec2 } from './vec2'

export interface AppContext {
  cursorAction$: StateObservable<CursorAction | null>

  cursor$: StateObservable<Vec2>
  cursorSize$: StateObservable<number>
  cursorInventory$: StateObservable<Record<string, number>>
  attachedRobotId$: StateObservable<string | null>

  camera$: StateObservable<Vec2>
  viewport$: StateObservable<Vec2>
  scale$: StateObservable<number>

  updateState(fn: (draft: State) => void): void
}

export const AppContext = React.createContext<AppContext>(
  null!,
)
