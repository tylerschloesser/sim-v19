import { useStateObservable } from '@react-rxjs/core'
import clsx from 'clsx'
import { useCallback, useContext } from 'react'
import invariant from 'tiny-invariant'
import { AppContext } from './app-context'
import {
  MineRobotTask,
  robotTaskTypeSchema,
} from './schema'

export function ActionButton() {
  const { cursorAction$, updateState } =
    useContext(AppContext)
  const cursorAction = useStateObservable(cursorAction$)

  const onClick = useCallback(() => {
    invariant(cursorAction)

    switch (cursorAction.type) {
      case 'mine': {
        updateState((draft) => {
          const robot =
            draft.world.robots[cursorAction.robotId]
          invariant(robot)
          invariant(robot.task === null)

          robot.task = {
            type: robotTaskTypeSchema.enum.Mine,
            entityId: cursorAction.entityId,
          } satisfies MineRobotTask
        })
        break
      }
      case 'stop': {
        updateState((draft) => {
          const robot =
            draft.world.robots[cursorAction.robotId]
          invariant(robot)
          robot.task = null
        })
        break
      }
      default: {
        invariant(false, 'TODO')
      }
    }
  }, [cursorAction, updateState])

  let label = ''
  switch (cursorAction?.type) {
    case 'mine':
      label = 'Mine'
      break
    case 'stop':
      label = 'Stop'
      break
    case 'build':
      label = 'Build'
      break
    default:
      break
  }

  return (
    <button
      onClick={onClick}
      disabled={!cursorAction}
      className={clsx(
        !cursorAction && 'opacity-50',
        cursorAction &&
          'pointer-events-auto cursor-pointer',
        'bg-white text-black rounded-full aspect-square',
        'flex justify-center items-center',
        'w-20 h-20',
      )}
    >
      <span>{label}</span>
    </button>
  )
}
