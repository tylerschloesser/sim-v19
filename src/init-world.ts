import { World } from './schema'

export async function initWorld(): Promise<World> {
  return {
    tick: 0,
    entities: {},
    nextEntityId: 0,
  }
}
