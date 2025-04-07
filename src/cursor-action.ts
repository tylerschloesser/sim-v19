import { EntityType } from './schema'
import { Vec2 } from './vec2'

export type CursorActionType = 'mine' | 'build' | 'attach'

export interface MineCursorAction {
  type: 'mine'
  entityId: string
  robotId: string
}

export interface StopCursorAction {
  type: 'stop'
  robotId: string
}

export interface BuildCursorAction {
  type: 'build'
  robotId: string
  entityType: EntityType
  position: Vec2
}

export interface AttachCursorAction {
  type: 'attach'
  robotId: string
}

export type CursorAction =
  | MineCursorAction
  | StopCursorAction
  | BuildCursorAction
  | AttachCursorAction
