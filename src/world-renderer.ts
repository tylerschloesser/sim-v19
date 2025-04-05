import { BehaviorSubject, Observable } from 'rxjs'
import invariant from 'tiny-invariant'
import { World } from './schema'
import { Vec2 } from './vec2'

export interface InitArgs {
  world$: Observable<World>
  camera$: BehaviorSubject<Vec2>
  viewport$: BehaviorSubject<Vec2>
  scale$: BehaviorSubject<number>
}

export interface WorldRenderer {
  init(args: InitArgs): Promise<void>
}

interface DomWorldRendererState {
  container: HTMLElement
  world$: Observable<World>
  entityIdToContainer: Map<string, HTMLElement>
}

export class DomWorldRenderer implements WorldRenderer {
  // @ts-expect-error
  private state?: DomWorldRendererState

  public async init({
    world$,
    camera$,
    viewport$,
    scale$,
  }: InitArgs): Promise<void> {
    const container = document.getElementById('world')
    invariant(container)

    const entityIdToContainer = new Map<
      string,
      HTMLElement
    >()

    world$.subscribe((world) => {
      for (const entity of Object.values(world.entities)) {
        let entityContainer = entityIdToContainer.get(
          entity.id,
        )
        if (!entityContainer) {
          entityContainer = document.createElement('div')
          container.appendChild(entityContainer)

          const { x, y } = new Vec2(entity.position).mul(
            scale$.value,
          )
          entityContainer.dataset['entityId'] = entity.id
          entityContainer.style.position = 'absolute'
          entityContainer.style.transform = `translate(${x}px, ${y}px)`
          entityContainer.style.width = `${scale$.value}px`
          entityContainer.style.height = `${scale$.value}px`
          entityContainer.style.backgroundColor =
            entity.color
        }
      }
    })

    camera$.subscribe((camera) => {
      const { x, y } = camera
        .mul(-1 * scale$.value)
        .add(viewport$.value.div(2))

      container.style.transform = `translate(${x}px, ${y}px)`
    })

    this.state = {
      container,
      world$,
      entityIdToContainer,
    }
  }
}
