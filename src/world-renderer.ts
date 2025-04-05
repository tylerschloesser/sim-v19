import { Observable } from 'rxjs'
import invariant from 'tiny-invariant'
import { World } from './schema'

export interface WorldRenderer {
  init(world$: Observable<World>): Promise<void>
}

interface DomWorldRendererState {
  container: HTMLElement
  world$: Observable<World>
}

export class DomWorldRenderer implements WorldRenderer {
  // @ts-expect-error
  private state?: DomWorldRendererState

  public async init(
    world$: Observable<World>,
  ): Promise<void> {
    const container = document.getElementById('world')
    invariant(container)

    world$.subscribe((world) => {
      console.log('world', world)
    })

    this.state = {
      container,
      world$,
    }
  }
}
