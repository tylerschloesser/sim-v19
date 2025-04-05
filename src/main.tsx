import { Application } from 'pixi.js'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BehaviorSubject, map, withLatestFrom } from 'rxjs'
import invariant from 'tiny-invariant'
import { GridContainer } from './grid-container'
import './index.css'
import { PointerController } from './pointer-controller'
import { World } from './schema'
import { Vec2 } from './vec2'
import {
  DomWorldRenderer,
  WorldRenderer,
} from './world-renderer'

async function main() {
  const container = document.getElementById('root')
  invariant(container)

  createRoot(container).render(
    <StrictMode>
      <></>
    </StrictMode>,
  )

  // prevent swipe forward/backward on iOS
  document.addEventListener(
    'touchstart',
    (ev) => {
      ev.preventDefault()
    },
    { passive: false },
  )

  const canvas = document.querySelector('canvas')
  invariant(canvas)

  const camera$ = new BehaviorSubject<Vec2>(
    new Vec2(0.5, 0.5),
  )
  let velocity: Vec2 | null = null

  const viewport$ = new BehaviorSubject<Vec2>(
    new Vec2(window.innerWidth, window.innerHeight),
  )
  const scale$ = new BehaviorSubject<number>(50)

  const world$ = new BehaviorSubject<World>({ tick: 0 })

  const app = new Application()

  await app.init({
    antialias: true,
    eventMode: 'none',
    canvas,
    resizeTo: window,
    resolution: window.devicePixelRatio,
    autoDensity: true,
  })

  app.stage.addChild(
    new GridContainer({ camera$, viewport$, scale$ }),
  )

  const worldRenderer: WorldRenderer =
    new DomWorldRenderer()
  await worldRenderer.init(world$)

  let lastFrame = self.performance.now()
  let callback: FrameRequestCallback = () => {
    const t = self.performance.now()

    const dt = (t - lastFrame) / 1000

    if (velocity) {
      const len = velocity.length()
      invariant(len > 0)

      const acceleration = velocity
        .normalize()
        // define the shape of the curve
        .mul((1 + len) ** 1.5 - 1)
        // stretch it a bit
        .mul(2)
        .mul(-1)

      velocity = velocity.add(acceleration.mul(dt))
      if (velocity.length() < 0.01) {
        velocity = null
      } else {
        camera$.next(camera$.value.add(velocity.mul(dt)))
      }
    }

    lastFrame = t
    self.requestAnimationFrame(callback)
  }
  self.requestAnimationFrame(callback)

  const pointerController = new PointerController(canvas)

  pointerController.drag$
    .pipe(
      withLatestFrom(scale$),
      map(([drag, scale]) => drag.div(scale).mul(-1)),
    )
    .subscribe((drag) => {
      velocity = null
      camera$.next(camera$.value.add(drag))
    })

  pointerController.release$
    .pipe(
      withLatestFrom(scale$),
      map(([release, scale]) => release.div(scale).mul(-1)),
    )
    .subscribe((release) => {
      velocity = release
    })
}

main()
