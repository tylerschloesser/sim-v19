import { useStateObservable } from '@react-rxjs/core'
import clsx from 'clsx'
import { useCallback, useContext } from 'react'
import invariant from 'tiny-invariant'
import { ActionButton } from './action-button'
import { AppContext } from './app-context'
import { BuildCursorAction } from './cursor-action'
import { CursorComponent } from './cursor-component'
import { EntityComponent } from './entity-component'
import { FurnaceEntityComponent } from './furnace-entity-component'
import { RobotComponent } from './robot-component'
import { entityTypeSchema } from './schema'
import { WorldComponent } from './world-component'

export function App() {
  const { entityIds$, robotIds$, cursorAction$ } =
    useContext(AppContext)
  const entityIds = useStateObservable(entityIds$)
  const robotIds = useStateObservable(robotIds$)
  const cursorAction = useStateObservable(cursorAction$)
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
        {cursorAction?.type === 'build' && (
          <BuildCursorActionComponent
            cursorAction={cursorAction}
          />
        )}
      </WorldComponent>
      <div className="absolute bottom-0 w-full flex justify-center">
        <div
          className={clsx('flex items-center gap-8 p-8')}
        >
          <RobotButton />
          <ActionButton />
          <TbdButton />
        </div>
      </div>
      <CursorComponent />
    </>
  )
}

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

function RobotButton() {
  const { cursorAction$, attachedRobotId$, updateState } =
    useContext(AppContext)
  const cursorAction = useStateObservable(cursorAction$)
  const attachedRobotId = useStateObservable(
    attachedRobotId$,
  )

  const label =
    cursorAction?.type === 'attach'
      ? 'Attach'
      : attachedRobotId
        ? 'Detach'
        : ''

  const onClick = useCallback(() => {
    updateState((draft) => {
      if (cursorAction?.type === 'attach') {
        const robot =
          draft.world.robots[cursorAction.robotId]
        invariant(robot)

        const cursor = draft.cursor
          .sub(draft.viewport.div(2))
          .div(draft.scale)
          .add(draft.camera)
        robot.position = cursor

        draft.attachedRobotId = robot.id
        return
      } else {
        draft.attachedRobotId = null
      }
    })
  }, [cursorAction, attachedRobotId, updateState])

  const disabled =
    cursorAction?.type !== 'attach' && !attachedRobotId

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        !disabled && 'pointer-events-auto cursor-pointer',
        disabled && 'opacity-50',
        'w-16 h-16 rounded-full bg-white',
        'flex justify-center items-center',
        'text-xs',
      )}
    >
      {label}
    </button>
  )
}

function TbdButton() {
  return (
    <div
      className={clsx(
        'w-16 h-16 rounded-full bg-white',
        'flex justify-center items-center',
        'text-xs',
        'opacity-10',
      )}
    >
      Tbd
    </div>
  )
}
