import { z } from 'zod'
import { ZVec2 } from './vec2'

export const entityTypeSchema = z.enum([
  'Resource',
  'Furnace',
])
export type EntityType = z.infer<typeof entityTypeSchema>

export const resourceEntitySchema = z.strictObject({
  type: z.literal(entityTypeSchema.enum.Resource),
  id: z.string(),
  position: ZVec2,
  color: z.string(),
})
export type ResourceEntity = z.infer<
  typeof resourceEntitySchema
>

export const furnaceEntitySchema = z.strictObject({
  type: z.literal(entityTypeSchema.enum.Furnace),
  id: z.string(),
  position: ZVec2,
  input: z.record(z.string(), z.number()),
  output: z.record(z.string(), z.number()),
})
export type FurnaceEntity = z.infer<
  typeof furnaceEntitySchema
>

export const entitySchema = z.discriminatedUnion('type', [
  resourceEntitySchema,
  furnaceEntitySchema,
])
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
