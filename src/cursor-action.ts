import { Entity, Robot } from './schema'

export type CursorActionType = 'mine' | 'build' | 'attach'

export interface MineCursorAction {
  type: 'mine'
  entity: Entity
}

export interface BuildCursorAction {
  type: 'build'
}

export interface AttachCursorAction {
  type: 'attach'
  robot: Robot
}

export type CursorAction =
  | MineCursorAction
  | BuildCursorAction
  | AttachCursorAction
