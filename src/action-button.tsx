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
  // @ts-expect-error
  type,
  action,
}: ActionButtonProps) {
  const { updateState } = useContext(AppContext)

  const onClick = useCallback(() => {
    invariant(action)
    updateState((draft) => handleAction(draft, action))
  }, [action, updateState])

  let label = ''
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
    default:
      break
  }

  return (
    <button
      onClick={onClick}
      disabled={!action}
      className={clsx(
        !action && 'opacity-50',
        action && 'pointer-events-auto cursor-pointer',
        'bg-white text-black rounded-full aspect-square',
        'flex justify-center items-center',
        'w-20 h-20',
      )}
    >
      <span>{label}</span>
    </button>
  )
}
