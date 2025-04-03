import { Application } from 'pixi.js'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BehaviorSubject } from 'rxjs'
import invariant from 'tiny-invariant'
import { GridContainer } from './grid-container'
import './index.css'
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
}

main()
