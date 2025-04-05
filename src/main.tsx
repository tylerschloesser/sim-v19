import { state, Subscribe } from '@react-rxjs/core'
import { produce } from 'immer'
import { Application } from 'pixi.js'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  BehaviorSubject,
  distinctUntilChanged,
  map,
  withLatestFrom,
} from 'rxjs'
import invariant from 'tiny-invariant'
import { ActionButton } from './action-button'
import { AppContext } from './app-context'
import { GridContainer } from './grid-container'
import './index.css'
import { PointerController } from './pointer-controller'
import { expandState, initState, State } from './state'
import { getSelectedEntityId } from './state-utils'
import { Vec2 } from './vec2'
import {
  DomWorldRenderer,
  WorldRenderer,
} from './world-renderer'

async function main() {
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

  const state$ = new BehaviorSubject<State>(
    await initState(),
  )

  const selectedEntityId$ = state$.pipe(
    map(getSelectedEntityId),
    distinctUntilChanged(),
  )

  selectedEntityId$.subscribe((selectedEntityId) => {
    console.log('selectedEntityId', selectedEntityId)
  })

  const container = document.getElementById('root')
  invariant(container)

  const context: AppContext = {
    selectedEntityId$: state(selectedEntityId$),
  }

  createRoot(container).render(
    <StrictMode>
      <AppContext.Provider value={context}>
        <Subscribe>
          <div className="absolute bottom-0 w-full flex justify-center">
            <div className="p-8">
              <ActionButton />
            </div>
          </div>
        </Subscribe>
      </AppContext.Provider>
    </StrictMode>,
  )

  function updateState(fn: (draft: State) => void): void {
    state$.next(produce(state$.value, fn))
  }

  const {
    camera$,
    viewport$,
    scale$,
    cursorSize$,
    cursor$,
    world$,
  } = expandState(state$)

  let velocity: Vec2 | null = null

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
  await worldRenderer.init({
    world$,
    camera$,
    viewport$,
    scale$,
  })

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
        updateState((draft) => {
          invariant(velocity)
          draft.camera = draft.camera.add(velocity.mul(dt))
        })
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
      updateState((draft) => {
        draft.camera = draft.camera.add(drag)
      })
    })

  pointerController.release$
    .pipe(
      withLatestFrom(scale$),
      map(([release, scale]) => release.div(scale).mul(-1)),
    )
    .subscribe((release) => {
      if (release.length() > 1) {
        velocity = release
      }
    })

  const cursorContainer = document.getElementById('cursor')
  invariant(cursorContainer)
  cursorSize$.subscribe((cursorSize) => {
    cursorContainer.style.width = `${cursorSize}px`
    cursorContainer.style.height = `${cursorSize}px`
    cursorContainer.style.top = `${-cursorSize / 2}px`
    cursorContainer.style.left = `${-cursorSize / 2}px`
  })

  const cursorPointerController = new PointerController(
    cursorContainer,
  )

  cursorPointerController.drag$.subscribe((drag) => {
    updateState((draft) => {
      draft.cursor = draft.cursor.add(drag)
    })
  })

  cursor$.subscribe((cursor) => {
    cursorContainer.style.transform = `translate(${cursor.x}px, ${cursor.y}px)`
  })
}

main()
