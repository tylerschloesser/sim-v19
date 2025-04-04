import { Application } from 'pixi.js'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BehaviorSubject, map, withLatestFrom } from 'rxjs'
import invariant from 'tiny-invariant'
import { GridContainer } from './grid-container'
import './index.css'
import { PointerController } from './pointer-controller'
import { Vec2 } from './vec2'

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
  const viewport$ = new BehaviorSubject<Vec2>(
    new Vec2(window.innerWidth, window.innerHeight),
  )
  const scale$ = new BehaviorSubject<number>(50)

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

  let lastFrame = self.performance.now()
  let callback: FrameRequestCallback = () => {
    const t = self.performance.now()

    // @ts-expect-error
    const dt = t - lastFrame

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
      console.log(drag)
      camera$.next(camera$.value.add(drag))
    })
}

main()
