import { useStateObservable } from '@react-rxjs/core'
import React, { useContext, useRef } from 'react'
import { takeUntil } from 'rxjs'
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
    const entity = useStateObservable(getEntity$(entityId))

    useEffectWithDestroy(
      (destroy$) => {
        scale$
          .pipe(takeUntil(destroy$))
          .subscribe((scale) => {
            invariant(ref.current)
            ref.current.style.width = `${scale}px`
            ref.current.style.height = `${scale}px`
            const { x, y } = new Vec2(entity.position).mul(
              scale,
            )
            ref.current.style.transform = `translate(${x}px, ${y}px)`
          })
      },
      [scale$, entity],
    )

    let children: React.ReactNode | null = null
    switch (entity.type) {
      case entityTypeSchema.enum.Resource: {
        children = (
          <ResourceEntityComponent color={entity.color} />
        )
        break
      }
    }

    return (
      <div
        data-entity-id={entityId}
        className="absolute"
        ref={ref}
      >
        {children}
      </div>
    )
  },
)

interface ResourceEntityComponentProps {
  color: string
}
const ResourceEntityComponent = React.memo(
  function ResourceEntityComponent({
    color,
  }: ResourceEntityComponentProps) {
    const { scale$ } = useContext(AppContext)
    const scale = useStateObservable(scale$)

    const rects: { x: number; y: number }[] = []

    const GRID_SIZE = 6
    for (let x = 0; x < GRID_SIZE; x++) {
      for (let y = 0; y < GRID_SIZE; y++) {
        switch (x % 2) {
          case 0:
            if (y % 2 === 0) {
              rects.push({ x, y })
            }
            break
          case 1:
            if (y % 2 === 1) {
              rects.push({ x, y })
            }
            break
        }
      }
    }

    return (
      <svg
        viewBox={`0 0 ${scale} ${scale}`}
        className="w-full h-full"
      >
        {rects.map(({ x, y }, i) => (
          <rect
            key={i}
            x={x * (scale / GRID_SIZE)}
            y={y * (scale / GRID_SIZE)}
            width={scale / GRID_SIZE}
            height={scale / GRID_SIZE}
            fill={color}
          />
        ))}
      </svg>
    )
  },
)
