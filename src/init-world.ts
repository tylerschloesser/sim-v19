import { World } from './schema'
import { Vec2 } from './vec2'

export async function initWorld(): Promise<World> {
  const entities: World['entities'] = {}
  let nextEntityId = 0

  function addEntity(
    position: { x: number; y: number },
    color: string,
  ) {
    const id = `${nextEntityId++}`
    entities[id] = {
      id,
      position,
      color,
    }
  }

  addEntity(new Vec2(0, 0), 'red')

  return {
    tick: 0,
    entities,
    nextEntityId,
  }
}
