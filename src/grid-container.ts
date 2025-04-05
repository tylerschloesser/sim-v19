import { Container, Graphics } from 'pixi.js'
import { combineLatest, Observable } from 'rxjs'
import { Vec2 } from './vec2'

interface ConstructorArgs {
  camera$: Observable<Vec2>
  viewport$: Observable<Vec2>
  scale$: Observable<number>
}

export class GridContainer extends Container {
  private g: Graphics

  constructor({
    camera$,
    viewport$,
    scale$,
  }: ConstructorArgs) {
    super()
    this.g = this.addChild(new Graphics())

    combineLatest([viewport$, scale$]).subscribe(
      ([viewport, scale]) => {
        this.g.clear()
        const { x: xx, y: yy } = viewport
          .div(scale)
          .ceil()
          .add(1)

        for (let x = 0; x < xx; x++) {
          this.g.moveTo(x * scale, 0)
          this.g.lineTo(x * scale, yy * scale)
        }
        for (let y = 0; y < yy; y++) {
          this.g.moveTo(0, y * scale)
          this.g.lineTo(xx * scale, y * scale)
        }

        this.g.stroke({
          width: 2,
          color: 'hsl(0, 0%, 20%)',
        })
      },
    )

    combineLatest([camera$, viewport$, scale$]).subscribe(
      ([camera, viewport, scale]) => {
        const { x, y } = camera
          .mul(-1 * scale)
          .add(viewport.div(2))
          .mod(scale)
          .sub(scale)

        this.position.set(x, y)
      },
    )
  }
}
