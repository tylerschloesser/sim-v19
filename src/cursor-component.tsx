import { useContext, useRef } from 'react'
import { takeUntil } from 'rxjs'
import invariant from 'tiny-invariant'
import { AppContext } from './app-context'
import { PointerController } from './pointer-controller'
import { useEffectWithDestroy } from './use-effect-with-destroy'
import { Vec2 } from './vec2'

export function CursorComponent() {
  const ref = useRef<HTMLDivElement>(null)

  const { cursor$, cursorSize$, updateState } =
    useContext(AppContext)

  useEffectWithDestroy(
    (destroy$) => {
      cursor$
        .pipe(takeUntil(destroy$))
        .subscribe((cursor) => {
          invariant(ref.current)
          ref.current.style.transform = `translate(${cursor.x}px, ${cursor.y}px)`
        })
    },
    [cursor$],
  )

  useEffectWithDestroy(
    (destroy$) => {
      cursorSize$
        .pipe(takeUntil(destroy$))
        .subscribe((cursorSize) => {
          invariant(ref.current)
          ref.current.style.width = `${cursorSize}px`
          ref.current.style.height = `${cursorSize}px`
          ref.current.style.top = `${-cursorSize / 2}px`
          ref.current.style.left = `${-cursorSize / 2}px`
        })
    },
    [cursorSize$],
  )

  useEffectWithDestroy(
    (destroy$) => {
      invariant(ref.current)
      const pointerController = new PointerController(
        ref.current,
      )
      pointerController.drag$
        .pipe(takeUntil(destroy$))
        .subscribe((drag) => {
          updateState((draft) => {
            draft.cursor = draft.cursor.add(drag)
            if (draft.attachedRobotId) {
              const robot =
                draft.world.robots[draft.attachedRobotId]
              invariant(robot)
              robot.position = new Vec2(robot.position).add(
                drag.div(draft.scale),
              )
            }
          })
        })
      return () => {
        pointerController.destroy()
      }
    },
    [updateState],
  )

  return (
    <div
      ref={ref}
      className="absolute pointer-events-auto border border-white rounded-full"
    />
  )
}
