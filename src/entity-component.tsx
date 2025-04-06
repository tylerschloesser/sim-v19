import React, { useContext, useRef } from 'react'
import {
  combineLatest,
  distinctUntilChanged,
  map,
  takeUntil,
} from 'rxjs'
import invariant from 'tiny-invariant'
import { AppContext } from './app-context'
import { entityTypeSchema } from './schema'
import { useEffectWithDestroy } from './use-effect-with-destroy'
import { Vec2 } from './vec2'

export interface EntityComponentProps {
  entityId: string
}

export const EntityComponent = React.memo(
  function EntityComponent({
    entityId,
  }: EntityComponentProps) {
    const ref = useRef<HTMLDivElement>(null)
    const { getEntity$, scale$ } = useContext(AppContext)

    useEffectWithDestroy(
      (destroy$) => {
        const entity$ = getEntity$(entityId)
        combineLatest([entity$, scale$])
          .pipe(takeUntil(destroy$))
          .subscribe(([entity, scale]) => {
            invariant(ref.current)
            ref.current.style.width = `${scale}px`
            ref.current.style.height = `${scale}px`

            switch (entity.type) {
              case entityTypeSchema.enum.Resource: {
                ref.current.style.backgroundColor =
                  entity.color
                break
              }
            }
          })
      },
      [getEntity$],
    )

    useEffectWithDestroy(
      (destroy$) => {
        const entity$ = getEntity$(entityId)
        const position$ = entity$.pipe(
          map((entity) => entity.position),
          distinctUntilChanged(),
        )
        combineLatest([position$, scale$])
          .pipe(takeUntil(destroy$))
          .subscribe(([position, scale]) => {
            invariant(ref.current)
            const { x, y } = new Vec2(position).mul(scale)
            ref.current.style.transform = `translate(${x}px, ${y}px)`
          })
      },
      [getEntity$],
    )

    return (
      <div
        data-entity-id={entityId}
        className="absolute"
        ref={ref}
      />
    )
  },
)
