import React, { useContext, useRef } from 'react'
import { combineLatest, takeUntil } from 'rxjs'
import invariant from 'tiny-invariant'
import { AppContext } from './app-context'
import { useEffectWithDestroy } from './use-effect-with-destroy'

export type WorldComponentProps =
  React.PropsWithChildren<{}>

export function WorldComponent({
  children,
}: WorldComponentProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { camera$, viewport$, scale$ } =
    useContext(AppContext)

  useEffectWithDestroy(
    (destroy$) => {
      combineLatest([camera$, viewport$, scale$])
        .pipe(takeUntil(destroy$))
        .subscribe(([camera, viewport, scale]) => {
          invariant(ref.current)
          const transform = camera
            .mul(scale)
            .sub(viewport.div(2))
            .mul(-1)
          ref.current.style.transform = `translate(${transform.x}px, ${transform.y}px)`
        })
    },
    [camera$, viewport$, scale$],
  )

  return (
    <div className="absolute" ref={ref}>
      {children}
    </div>
  )
}
