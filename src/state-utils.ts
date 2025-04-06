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
