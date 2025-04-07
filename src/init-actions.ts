import { isEqual } from 'lodash-es'
import { distinctUntilChanged, map, Observable } from 'rxjs'
import invariant from 'tiny-invariant'
import {
  AttachCursorAction,
  BuildCursorAction,
  CursorAction,
  MineCursorAction,
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
                break
              }
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
      }
      return actions
    }),
    distinctUntilChanged(isEqual),
  )
}
