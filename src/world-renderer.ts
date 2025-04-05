import { Observable } from 'rxjs'
import { World } from './schema'

export interface WorldRenderer {
  init(world$: Observable<World>): Promise<void>
}

export class DomWorldRenderer implements WorldRenderer {
  private world$: Observable<World> | null = null

  public async init(
    world$: Observable<World>,
  ): Promise<void> {
    this.world$ = world$
    this.world$.subscribe((world) => {
      console.log('world', world)
    })
  }
}
