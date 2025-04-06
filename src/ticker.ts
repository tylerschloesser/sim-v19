import invariant from 'tiny-invariant'
import {
  entityTypeSchema,
  robotTaskTypeSchema,
} from './schema'
import { State } from './state'

export function tickState(state: State) {
  state.world.tick += 1

  for (const robot of Object.values(state.world.robots)) {
    if (robot.task) {
      switch (robot.task.type) {
        case robotTaskTypeSchema.enum.Mine: {
          const entity =
            state.world.entities[robot.task.entityId]
          invariant(
            entity?.type === entityTypeSchema.enum.Resource,
          )
          robot.inventory[entity.color] =
            (robot.inventory[entity.color] ?? 0) + 1
          break
        }
      }
    }
  }
}
