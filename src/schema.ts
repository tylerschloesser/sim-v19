import { z } from 'zod'
import { ZVec2 } from './vec2'

export const entitySchema = z.strictObject({
  id: z.string(),
  position: ZVec2,
  color: z.string(),
})
export type Entity = z.infer<typeof entitySchema>

export const robotTaskTypeSchema = z.enum(['Mine'])
export type RobotTaskType = z.infer<
  typeof robotTaskTypeSchema
>

export const mineRobotTaskSchema = z.strictObject({
  type: z.literal(robotTaskTypeSchema.enum.Mine),
  entityId: z.string(),
})
export type MineRobotTask = z.infer<
  typeof mineRobotTaskSchema
>

export const robotTaskSchema = z.discriminatedUnion(
  'type',
  [mineRobotTaskSchema],
)

export const robotSchema = z.strictObject({
  id: z.string(),
  position: ZVec2,
  radius: z.number(),
  inventory: z.record(z.string(), z.number()),
  task: robotTaskSchema.nullable(),
})
export type Robot = z.infer<typeof robotSchema>

export const worldSchema = z.strictObject({
  tick: z.number(),
  entities: z.record(entitySchema),
  nextEntityId: z.number(),
  robots: z.record(robotSchema),
  nextRobotId: z.number(),
})
export type World = z.infer<typeof worldSchema>
