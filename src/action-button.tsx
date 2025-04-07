import clsx from 'clsx'
import { useCallback, useContext } from 'react'
import invariant from 'tiny-invariant'
import { AppContext } from './app-context'
import { CursorAction } from './cursor-action'
import { handleAction } from './state-utils'

export interface ActionButtonProps {
  type: 'primary' | 'secondary' | 'tertiary'
  action?: CursorAction
}

export function ActionButton({
  type,
  action,
}: ActionButtonProps) {
  const { updateState } = useContext(AppContext)

  const onClick = useCallback(() => {
    invariant(action)
    updateState((draft) => handleAction(draft, action))
  }, [action, updateState])

  let label: React.ReactNode | string | null = null
  switch (action?.type) {
    case 'attach':
      label = 'Attach'
      break
    case 'detach':
      label = 'Detach'
      break
    case 'mine':
      label = 'Mine'
      break
    case 'stop':
      label = 'Stop'
      break
    case 'build':
      label = 'Build'
      break
    case 'drop':
      label = (
        <span className="text-xs flex flex-col gap-1">
          <span>Drop</span>
          <span className="flex gap-1 items-center">
            {action.count}
            <span
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: action.color }}
            />
          </span>
        </span>
      )
      break
    case 'pickup':
      label = (
        <span className="text-xs flex flex-col gap-1">
          <span>Pickup</span>
          <span className="flex gap-1 items-center">
            {action.count}
            <span
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: action.color }}
            />
          </span>
        </span>
      )
      break
    default:
      break
  }

  return (
    <button
      onClick={onClick}
      disabled={!action}
      className={clsx(
        !action && 'opacity-20',
        action && 'pointer-events-auto cursor-pointer',
        'bg-white text-black rounded-full aspect-square',
        'flex justify-center items-center',
        type === 'primary' ? 'w-20 h-20' : 'w-16 h-16',
      )}
    >
      {label}
    </button>
  )
}
