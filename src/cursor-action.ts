export type CursorActionType = 'mine' | 'build' | 'attach'

export interface MineCursorAction {
  type: 'mine'
  entityId: string
  robotId: string
}

export interface BuildCursorAction {
  type: 'build'
}

export interface AttachCursorAction {
  type: 'attach'
  robotId: string
}

export type CursorAction =
  | MineCursorAction
  | BuildCursorAction
  | AttachCursorAction
