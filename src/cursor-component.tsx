import { useStateObservable } from '@react-rxjs/core'
import clsx from 'clsx'
import { useContext, useRef } from 'react'
import { takeUntil } from 'rxjs'
import invariant from 'tiny-invariant'
import { AppContext } from './app-context'
import { PointerController } from './pointer-controller'
import { useEffectWithDestroy } from './use-effect-with-destroy'

export function CursorComponent() {
  const ref = useRef<HTMLDivElement>(null)

  const {
    selectedEntityId$,
    cursor$,
    cursorSize$,
    updateState,
  } = useContext(AppContext)

  const selectedEntityId = useStateObservable(
    selectedEntityId$,
  )

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
    >
      {selectedEntityId && (
        <div
          className={clsx(
            'absolute left-full bottom-full',
            'text-white',
            'pointer-events-none',
            'text-nowrap',
          )}
        >
          Entity: {selectedEntityId}
        </div>
      )}
    </div>
  )
}
