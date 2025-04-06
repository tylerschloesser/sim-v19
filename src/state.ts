import {
  BehaviorSubject,
  distinctUntilChanged,
  map,
  Observable,
} from 'rxjs'
import invariant from 'tiny-invariant'
import { initWorld } from './init-world'
import { World } from './schema'
import { Vec2 } from './vec2'

export interface State {
  camera: Vec2
  viewport: Vec2
  scale: number
  cursorSize: number
  cursor: Vec2
  attachedRobotId: string | null
  world: World
}

export async function initState(): Promise<State> {
  const viewport = new Vec2(
    window.innerWidth,
    window.innerHeight,
  )
  const scale = 50
  const world = await initWorld()

  const attachedRobotId = Object.keys(world.robots)[0]
  invariant(attachedRobotId)

  return {
    camera: new Vec2(0.5, 0.5),
    viewport,
    scale,
    cursorSize: scale * 1.5,
    cursor: viewport.div(2),
    attachedRobotId,
    world,
  }
}

export function expandState(
  state$: BehaviorSubject<State>,
): {
  camera$: Observable<Vec2>
  viewport$: Observable<Vec2>
  scale$: Observable<number>
  cursorSize$: Observable<number>
  cursor$: Observable<Vec2>
  attachedRobotId$: Observable<string | null>
  world$: Observable<World>
  entityIds$: Observable<string[]>
  robotIds$: Observable<string[]>
} {
  const camera$ = state$.pipe(
    map((state) => state.camera),
    distinctUntilChanged(),
  )
  const viewport$ = state$.pipe(
    map((state) => state.viewport),
    distinctUntilChanged(),
  )
  const scale$ = state$.pipe(
    map((state) => state.scale),
    distinctUntilChanged(),
  )
  const cursorSize$ = state$.pipe(
    map((state) => state.cursorSize),
    distinctUntilChanged(),
  )
  const cursor$ = state$.pipe(
    map((state) => state.cursor),
    distinctUntilChanged(),
  )
  const attachedRobotId$ = state$.pipe(
    map((state) => state.attachedRobotId),
    distinctUntilChanged(),
  )
  const world$ = state$.pipe(
    map((state) => state.world),
    distinctUntilChanged(),
  )
  const entityIds$ = world$.pipe(
    map((world) => Object.keys(world.entities)),
  )
  const robotIds$ = world$.pipe(
    map((world) => Object.keys(world.robots)),
  )
  return {
    camera$,
    viewport$,
    scale$,
    cursorSize$,
    cursor$,
    attachedRobotId$,
    world$,
    entityIds$,
    robotIds$,
  }
}
