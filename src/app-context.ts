import { StateObservable } from '@react-rxjs/core'
import React from 'react'
import { CursorAction } from './cursor-action'
import { Robot } from './schema'
import { State } from './state'
import { Vec2 } from './vec2'

export interface AppContext {
  cursorAction$: StateObservable<CursorAction | null>

  cursor$: StateObservable<Vec2>
  cursorSize$: StateObservable<number>
  attachedRobotId$: StateObservable<string | null>

  camera$: StateObservable<Vec2>
  viewport$: StateObservable<Vec2>
  scale$: StateObservable<number>

  updateState(fn: (draft: State) => void): void

  getRobot$: (robotId: string) => StateObservable<Robot>
  getRobotInventory$: (
    robotId: string,
  ) => StateObservable<Robot['inventory']>
  getRobotTask$: (
    robotId: string,
  ) => StateObservable<Robot['task']>

  robotIds$: StateObservable<string[]>
}

export const AppContext = React.createContext<AppContext>(
  null!,
)
