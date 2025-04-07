import { useStateObservable } from '@react-rxjs/core'
import clsx from 'clsx'
import React, { useContext } from 'react'
import invariant from 'tiny-invariant'
import { ActionButton } from './action-button'
import { AppContext } from './app-context'
import { BuildCursorAction } from './cursor-action'
import { CursorComponent } from './cursor-component'
import { EntityComponent } from './entity-component'
import { FurnaceEntityComponent } from './furnace-entity-component'
import { RobotComponent } from './robot-component'
import { entityTypeSchema } from './schema'
import { StorageEntityComponent } from './storage-entity-component'
import { WorldComponent } from './world-component'

export function App() {
  const { entityIds$, robotIds$, buildAction$ } =
    useContext(AppContext)
  const entityIds = useStateObservable(entityIds$)
  const robotIds = useStateObservable(robotIds$)
  const buildAction = useStateObservable(buildAction$)

  return (
    <>
      <WorldComponent>
        {entityIds.map((entityId) => (
          <EntityComponent
            entityId={entityId}
            key={entityId}
          />
        ))}
        {robotIds.map((robotId) => (
          <RobotComponent robotId={robotId} key={robotId} />
        ))}
        {buildAction && (
          <BuildCursorActionComponent
            cursorAction={buildAction}
          />
        )}
      </WorldComponent>
      <ActionBar />
      <CursorComponent />
    </>
  )
}

const ActionBar = React.memo(function ActionBar() {
  const { actions$ } = useContext(AppContext)
  const actions = useStateObservable(actions$)
  return (
    <div className="absolute bottom-0 w-full pb-8">
      <div className="flex justify-evenly items-center">
        <ActionButton
          type="secondary"
          action={actions[1]}
        />
        <ActionButton type="primary" action={actions[0]} />
        <ActionButton type="tertiary" action={actions[2]} />
      </div>
    </div>
  )
})

interface BuildCursorActionComponentProps {
  cursorAction: BuildCursorAction
}

function BuildCursorActionComponent({
  cursorAction,
}: BuildCursorActionComponentProps) {
  const { scale$ } = useContext(AppContext)
  const scale = useStateObservable(scale$)

  const translate = cursorAction.position.mul(scale)

  let children: React.ReactNode
  switch (cursorAction.entityType) {
    case entityTypeSchema.enum.Furnace: {
      children = <FurnaceEntityComponent />
      break
    }
    case entityTypeSchema.enum.Storage: {
      children = <StorageEntityComponent inventory={{}} />
      break
    }
    default: {
      invariant(false, 'TODO')
    }
  }

  return (
    <div
      className={clsx('absolute opacity-50', 'text-xs')}
      style={{
        width: `${scale}px`,
        height: `${scale}px`,
        transform: `translate(${translate.x}px, ${translate.y}px)`,
      }}
    >
      {children}
    </div>
  )
}
