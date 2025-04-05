import { Observable } from 'rxjs'
import invariant from 'tiny-invariant'
import { World } from './schema'
import { Vec2 } from './vec2'

export interface InitArgs {
  world$: Observable<World>
  camera$: Observable<Vec2>
  viewport$: Observable<Vec2>
  scale$: Observable<number>
}

export interface WorldRenderer {
  init(args: InitArgs): Promise<void>
}

interface DomWorldRendererState {
  container: HTMLElement
  world$: Observable<World>
}

export class DomWorldRenderer implements WorldRenderer {
  // @ts-expect-error
  private state?: DomWorldRendererState

  public async init({ world$ }: InitArgs): Promise<void> {
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
