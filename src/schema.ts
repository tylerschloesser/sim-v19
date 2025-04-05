import { z } from 'zod'
import { ZVec2 } from './vec2'

export const entitySchema = z.strictObject({
  id: z.string(),
  position: ZVec2,
  color: z.string(),
})
export type Entity = z.infer<typeof entitySchema>

export const worldSchema = z.strictObject({
  tick: z.number(),
  entities: z.record(entitySchema),
  nextEntityId: z.number(),
})
export type World = z.infer<typeof worldSchema>

export const cursorSchema = z.strictObject({
  position: ZVec2,
})
export type Cursor = z.infer<typeof cursorSchema>
