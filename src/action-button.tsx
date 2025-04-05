import { useStateObservable } from '@react-rxjs/core'
import clsx from 'clsx'
import { useCallback, useContext } from 'react'
import invariant from 'tiny-invariant'
import { AppContext } from './app-context'

export function ActionButton() {
  const { cursorAction$, updateState } =
    useContext(AppContext)
  const cursorAction = useStateObservable(cursorAction$)

  const onClick = useCallback(() => {
    invariant(cursorAction)

    switch (cursorAction.type) {
      case 'mine': {
        const { entity } = cursorAction
        updateState((draft) => {
          draft.cursorInventory[entity.color] =
            (draft.cursorInventory[entity.color] ?? 0) + 1
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
