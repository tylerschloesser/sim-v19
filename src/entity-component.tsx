import { useStateObservable } from '@react-rxjs/core'
import React, { useContext, useRef } from 'react'
import { takeUntil } from 'rxjs'
import invariant from 'tiny-invariant'
import { AppContext } from './app-context'
import { FurnaceEntityComponent } from './furnace-entity-component'
import { ResourceEntityComponent } from './resource-entity-component'
import { entityTypeSchema } from './schema'
import { StorageEntityComponent } from './storage-entity-component'
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
      case entityTypeSchema.enum.Furnace: {
        children = <FurnaceEntityComponent />
        break
      }
      case entityTypeSchema.enum.Storage: {
        children = <StorageEntityComponent />
        break
      }
      default: {
        invariant(false, 'TODO')
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
