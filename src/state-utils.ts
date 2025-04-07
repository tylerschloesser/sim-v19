import { isInteger } from 'lodash-es'
import invariant from 'tiny-invariant'
import { CursorAction } from './cursor-action'
import { getRecipe } from './recipe'
import {
  Entity,
  entityTypeSchema,
  FurnaceEntity,
  MineRobotTask,
  robotTaskTypeSchema,
  StorageEntity,
} from './schema'
import { State } from './state'
import { Vec2 } from './vec2'

export function getSelectedEntityId(
  state: State,
): string | null {
  const cursor = state.cursor
    .sub(state.viewport.div(2))
    .div(state.scale)
    .add(state.camera)

  for (const entity of Object.values(
    state.world.entities,
  )) {
    const { position } = entity
    if (
      cursor.x >= position.x &&
      cursor.x <= position.x + 1 &&
      cursor.y >= position.y &&
      cursor.y <= position.y + 1
    ) {
      return entity.id
    }
  }

  return null
}

export function getSelectedRobotId(
  state: State,
): string | null {
  if (state.attachedRobotId) {
    return null
  }

  const cursor = state.cursor
    .sub(state.viewport.div(2))
    .div(state.scale)
    .add(state.camera)

  for (const robot of Object.values(state.world.robots)) {
    const d = cursor.sub(new Vec2(robot.position))
    if (d.length() <= robot.radius) {
      return robot.id
    }
  }

  return null
}

export function inventorySub(
  inventory: Record<string, number>,
  key: string,
  count: number,
): void {
  invariant(isInteger(count))
  invariant(count > 0)
  invariant(inventory[key] ?? 0 >= count)
  inventory[key]! -= count
  if (inventory[key] === 0) {
    delete inventory[key]
  }
}

export function inventorySubMany(
  inventory: Record<string, number>,
  many: Record<string, number>,
): void {
  for (const [key, count] of Object.entries(many)) {
    inventorySub(inventory, key, count)
  }
}

export function inventoryHas(
  inventory: Record<string, number>,
  key: string,
  count: number = 1,
): boolean {
  invariant(isInteger(count))
  invariant(count > 0)
  return (inventory[key] ?? 0) >= count
}

export function inventoryHasMany(
  inventory: Record<string, number>,
  many: Record<string, number>,
): boolean {
  for (const [key, count] of Object.entries(many)) {
    if (!inventoryHas(inventory, key, count)) {
      return false
    }
  }
  return true
}

export function handleAction(
  draft: State,
  action: CursorAction,
): void {
  switch (action.type) {
    case 'attach': {
      const robot = draft.world.robots[action.robotId]
      invariant(robot)
      const cursor = draft.cursor
        .sub(draft.viewport.div(2))
        .div(draft.scale)
        .add(draft.camera)
      robot.position = cursor
      draft.attachedRobotId = robot.id
      break
    }
    case 'detach': {
      invariant(draft.attachedRobotId)
      draft.attachedRobotId = null
      break
    }
    case 'mine': {
      const robot = draft.world.robots[action.robotId]
      invariant(robot)
      invariant(robot.task === null)

      robot.task = {
        type: robotTaskTypeSchema.enum.Mine,
        entityId: action.entityId,
      } satisfies MineRobotTask
      break
    }
    case 'stop': {
      const robot = draft.world.robots[action.robotId]
      invariant(robot)
      invariant(robot.task)
      robot.task = null
      break
    }
    case 'build': {
      const robot = draft.world.robots[action.robotId]
      invariant(robot)
      const recipe = getRecipe(action.entityType)
      inventorySubMany(robot.inventory, recipe)
      let entity: Entity
      const id = `${draft.world.nextEntityId++}`
      const position = action.position
      switch (action.entityType) {
        case entityTypeSchema.enum.Furnace: {
          entity = {
            id,
            type: entityTypeSchema.enum.Furnace,
            position,
            input: {},
            output: {},
          } satisfies FurnaceEntity
          break
        }
        case entityTypeSchema.enum.Storage: {
          entity = {
            id,
            type: entityTypeSchema.enum.Storage,
            position,
            inventory: {},
          } satisfies StorageEntity
          break
        }
        default: {
          invariant(false, 'TODO')
        }
      }
      draft.world.entities[id] = entity
      break
    }
  }
}
