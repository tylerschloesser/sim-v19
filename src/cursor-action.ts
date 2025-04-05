import { Entity } from './schema'

export type CursorActionType = 'mine' | 'build'

export interface MineCursorAction {
  type: 'mine'
  entity: Entity
}

export interface BuildCursorAction {
  type: 'build'
}

export type CursorAction =
  | MineCursorAction
  | BuildCursorAction
