import { State } from './state'

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
