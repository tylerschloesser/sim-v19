import { z } from 'zod'

export const worldSchema = z.strictObject({
  tick: z.number(),
})

export type World = z.infer<typeof worldSchema>
