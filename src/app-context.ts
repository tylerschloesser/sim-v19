import { StateObservable } from '@react-rxjs/core'
import React from 'react'
import {
  BuildCursorAction,
  CursorAction,
} from './cursor-action'
import { Entity, Robot } from './schema'
import { State } from './state'
import { Vec2 } from './vec2'

export interface AppContext {
  actions$: StateObservable<CursorAction[]>
  buildAction$: StateObservable<BuildCursorAction | null>

  cursor$: StateObservable<Vec2>
  cursorSize$: StateObservable<number>
  attachedRobotId$: StateObservable<string | null>

  camera$: StateObservable<Vec2>
  viewport$: StateObservable<Vec2>
  scale$: StateObservable<number>

  updateState(fn: (draft: State) => void): void

  getEntity$: (entityId: string) => StateObservable<Entity>

  getRobot$: (robotId: string) => StateObservable<Robot>
  getRobotInventory$: (
    robotId: string,
  ) => StateObservable<Robot['inventory']>
  getRobotTask$: (
    robotId: string,
  ) => StateObservable<Robot['task']>

  entityIds$: StateObservable<string[]>
  robotIds$: StateObservable<string[]>
}

export const AppContext = React.createContext<AppContext>(
  null!,
)
