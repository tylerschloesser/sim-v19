import { isEqual } from 'lodash-es'
import { distinctUntilChanged, map, Observable } from 'rxjs'
import invariant from 'tiny-invariant'
import {
  AttachCursorAction,
  BuildCursorAction,
  CursorAction,
  DetachCursorAction,
  DropCursorAction,
  MineCursorAction,
  PickupCursorAction,
  StopCursorAction,
} from './cursor-action'
import { getRecipe } from './recipe'
import {
  entityTypeSchema,
  robotTaskTypeSchema,
} from './schema'
import { State } from './state'
import {
  getSelectedEntityId,
  getSelectedRobotId,
  inventoryEmpty,
  inventoryHasMany,
} from './state-utils'
import { Vec2 } from './vec2'

export function initActions(
  state$: Observable<State>,
): Observable<CursorAction[]> {
  return state$.pipe(
    map((state) => {
      const actions: CursorAction[] = []

      if (!state.attachedRobotId) {
        const selectedRobotId = getSelectedRobotId(state)
        if (selectedRobotId) {
          actions.push({
            type: 'attach',
            robotId: selectedRobotId,
          } satisfies AttachCursorAction)
        }
      } else {
        const robot =
          state.world.robots[state.attachedRobotId]
        invariant(robot)

        if (robot.task) {
          switch (robot.task.type) {
            case robotTaskTypeSchema.enum.Mine: {
              actions.push({
                type: 'stop',
                robotId: state.attachedRobotId,
              } satisfies StopCursorAction)
              break
            }
            default: {
              invariant(false, 'TODO')
            }
          }
        }

        const selectedEntityId = getSelectedEntityId(state)
        if (selectedEntityId) {
          const entity =
            state.world.entities[selectedEntityId]
          invariant(entity)

          switch (entity.type) {
            case entityTypeSchema.enum.Resource: {
              if (
                robot.task?.type !==
                  robotTaskTypeSchema.enum.Mine ||
                robot.task.entityId !== selectedEntityId
              ) {
                actions.push({
                  type: 'mine',
                  entityId: selectedEntityId,
                  robotId: state.attachedRobotId,
                } satisfies MineCursorAction)
              }
              break
            }
            case entityTypeSchema.enum.Storage: {
              if (!inventoryEmpty(entity.inventory)) {
                const color = Object.keys(
                  entity.inventory,
                )[0]
                invariant(color)
                const count = entity.inventory[color]
                invariant(count)
                actions.push({
                  type: 'pickup',
                  entityId: selectedEntityId,
                  robotId: state.attachedRobotId,
                  color,
                  count,
                } satisfies PickupCursorAction)
              }
              if (!inventoryEmpty(robot.inventory)) {
                const color = Object.keys(
                  robot.inventory,
                )[0]
                invariant(color)
                const count = robot.inventory[color]
                invariant(count)
                actions.push({
                  type: 'drop',
                  entityId: selectedEntityId,
                  robotId: state.attachedRobotId,
                  color,
                  count,
                } satisfies DropCursorAction)
              }
              break
            }
          }
        } else {
          for (const entityType of [
            entityTypeSchema.enum.Furnace,
            entityTypeSchema.enum.Storage,
          ]) {
            const recipe = getRecipe(entityType)
            if (inventoryHasMany(robot.inventory, recipe)) {
              actions.push({
                type: 'build',
                robotId: state.attachedRobotId,
                entityType,
                position: new Vec2(robot.position).floor(),
              } satisfies BuildCursorAction)
            }
          }
        }

        actions.push({
          type: 'detach',
        } satisfies DetachCursorAction)
      }
      return actions
    }),
    distinctUntilChanged(isEqual),
  )
}
