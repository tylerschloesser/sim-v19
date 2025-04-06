import { combineLatest, Observable } from 'rxjs'
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
  entityIdToContainer: Map<string, HTMLElement>
  robotIdToContainer: Map<string, HTMLElement>
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

    combineLatest([world$, scale$]).subscribe(
      ([world, scale]) => {
        for (const entity of Object.values(
          world.entities,
        )) {
          let entityContainer = entityIdToContainer.get(
            entity.id,
          )
          if (!entityContainer) {
            entityContainer = document.createElement('div')
            container.appendChild(entityContainer)

            const { x, y } = new Vec2(entity.position).mul(
              scale,
            )
            entityContainer.dataset['entityId'] = entity.id
            entityContainer.style.position = 'absolute'
            entityContainer.style.transform = `translate(${x}px, ${y}px)`
            entityContainer.style.width = `${scale}px`
            entityContainer.style.height = `${scale}px`
            entityContainer.style.backgroundColor =
              entity.color
          }
        }
      },
    )

    const robotIdToContainer = new Map<
      string,
      HTMLElement
    >()

    combineLatest([world$, scale$]).subscribe(
      ([world, scale]) => {
        for (const robot of Object.values(world.robots)) {
          let robotContainer = robotIdToContainer.get(
            robot.id,
          )
          if (!robotContainer) {
            robotContainer = document.createElement('div')
            container.appendChild(robotContainer)

            const r = robot.radius * scale
            robotContainer.dataset['robotId'] = robot.id
            robotContainer.style.position = 'absolute'
            robotContainer.style.border = '1px solid white'
            robotContainer.style.borderRadius = '100%'
            robotContainer.style.width = `${r * 2}px`
            robotContainer.style.height = `${r * 2}px`
            robotContainer.style.top = `-${r}px`
            robotContainer.style.left = `-${r}px`
          }

          const { x, y } = new Vec2(robot.position).mul(
            scale,
          )
          robotContainer.style.transform = `translate(${x}px, ${y}px)`
        }
      },
    )

    combineLatest([camera$, scale$, viewport$]).subscribe(
      ([camera, scale, viewport]) => {
        const { x, y } = camera
          .mul(-1 * scale)
          .add(viewport.div(2))
        container.style.transform = `translate(${x}px, ${y}px)`
      },
    )

    this.state = {
      container,
      world$,
      entityIdToContainer,
      robotIdToContainer,
    }
  }
}
