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
  addEntity(new Vec2(2, 2), 'green')
  addEntity(new Vec2(-3, -3), 'blue')

  return {
    tick: 0,
    entities,
    nextEntityId,
    robots: {},
    nextRobotId: 0,
  }
}
