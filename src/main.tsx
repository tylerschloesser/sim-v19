import { state, Subscribe } from '@react-rxjs/core'
import { produce } from 'immer'
import { Application } from 'pixi.js'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  BehaviorSubject,
  distinctUntilChanged,
  filter,
  map,
  withLatestFrom,
} from 'rxjs'
import invariant from 'tiny-invariant'
import { App } from './app'
import { AppContext } from './app-context'
import {
  AttachCursorAction,
  BuildCursorAction,
  MineCursorAction,
  StopCursorAction,
} from './cursor-action'
import { GridContainer } from './grid-container'
import './index.css'
import { PointerController } from './pointer-controller'
import { entityTypeSchema } from './schema'
import { expandState, initState, State } from './state'
import {
  getSelectedEntityId,
  getSelectedRobotId,
} from './state-utils'
import { tickState } from './ticker'
import { Vec2 } from './vec2'

async function main() {
  const canvas = document.querySelector('canvas')
  invariant(canvas)

  // Prevent swipe navigation on iOS. Specifically do this on canvas because document blocks other touches.
  canvas.addEventListener(
    'touchstart',
    (ev) => {
      ev.preventDefault()
    },
    { passive: false },
  )

  const state$ = new BehaviorSubject<State>(
    await initState(),
  )

  function updateState(fn: (draft: State) => void): void {
    state$.next(produce(state$.value, fn))
  }

  self.setInterval(() => updateState(tickState), 5000)

  function updateCamera(d: Vec2): void {
    updateState((draft) => {
      draft.camera = draft.camera.add(d)

      if (draft.attachedRobotId) {
        const robot =
          draft.world.robots[draft.attachedRobotId]
        invariant(robot)
        robot.position = new Vec2(robot.position).add(d)
      }
    })
  }

  const {
    camera$,
    viewport$,
    scale$,
    cursorSize$,
    cursor$,
    attachedRobotId$,
    world$,
    entityIds$,
    robotIds$,
  } = expandState(state$)

  const cursorAction$ = state$.pipe(
    map((state) => {
      const selectedEntityId = getSelectedEntityId(state)
      if (state.attachedRobotId) {
        const robot =
          state.world.robots[state.attachedRobotId]
        invariant(robot)
        if (robot.task) {
          return {
            type: 'stop',
            robotId: robot.id,
          } satisfies StopCursorAction
        }
        if ((robot.inventory['red'] ?? 0) >= 5) {
          return {
            type: 'build',
            entityType: entityTypeSchema.enum.Furnace,
          } satisfies BuildCursorAction
        }
        if (selectedEntityId) {
          return {
            type: 'mine',
            entityId: selectedEntityId,
            robotId: state.attachedRobotId,
          } satisfies MineCursorAction
        }
      }
      const selectedRobotId = getSelectedRobotId(state)
      if (selectedRobotId) {
        const robot = state.world.robots[selectedRobotId]
        invariant(robot)
        return {
          type: 'attach',
          robotId: robot.id,
        } satisfies AttachCursorAction
      }
      return null
    }),
    distinctUntilChanged(),
  )

  const container = document.getElementById('root')
  invariant(container)

  const getEntity$ = state((entityId: string) =>
    world$.pipe(
      map((world) => world.entities[entityId]),
      filter((value) => value !== undefined),
      distinctUntilChanged(),
    ),
  )

  const getRobot$ = state((robotId: string) =>
    world$.pipe(
      map((world) => world.robots[robotId]),
      filter((value) => value !== undefined),
      distinctUntilChanged(),
    ),
  )

  const getRobotInventory$ = state((robotId: string) =>
    world$.pipe(
      map((world) => world.robots[robotId]),
      filter((value) => value !== undefined),
      map((robot) => robot.inventory),
      distinctUntilChanged(),
    ),
  )

  const getRobotTask$ = state((robotId: string) =>
    world$.pipe(
      map((world) => world.robots[robotId]),
      filter((value) => value !== undefined),
      map((robot) => robot.task),
      distinctUntilChanged(),
    ),
  )

  const context: AppContext = {
    cursorAction$: state(cursorAction$),
    cursor$: state(cursor$),
    cursorSize$: state(cursorSize$),
    attachedRobotId$: state(attachedRobotId$),
    camera$: state(camera$),
    viewport$: state(viewport$),
    scale$: state(scale$),
    updateState,
    getEntity$,
    getRobot$,
    getRobotInventory$,
    getRobotTask$,
    entityIds$: state(entityIds$),
    robotIds$: state(robotIds$),
  }

  createRoot(container).render(
    <StrictMode>
      <AppContext.Provider value={context}>
        <Subscribe>
          <App />
        </Subscribe>
      </AppContext.Provider>
    </StrictMode>,
  )

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
        const d = velocity.mul(dt)
        updateCamera(d)
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
      updateCamera(drag)
    })

  pointerController.release$
    .pipe(
      withLatestFrom(scale$),
      map(([release, scale]) => release.div(scale).mul(-1)),
    )
    .subscribe((release) => {
      if (release.length() > 4) {
        velocity = release
      }
    })
}

main()
