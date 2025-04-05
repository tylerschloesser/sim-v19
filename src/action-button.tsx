import { useStateObservable } from '@react-rxjs/core'
import clsx from 'clsx'
import { useCallback, useContext } from 'react'
import invariant from 'tiny-invariant'
import { AppContext } from './app-context'

export function ActionButton() {
  const { selectedEntity$, updateState } =
    useContext(AppContext)
  const selectedEntity = useStateObservable(selectedEntity$)

  const onClick = useCallback(() => {
    invariant(selectedEntity)
    console.log('hi')

    updateState((draft) => {
      draft.cursorInventory[selectedEntity.color] =
        (draft.cursorInventory[selectedEntity.color] ?? 0) +
        1
    })
  }, [selectedEntity, updateState])

  return (
    <button
      onClick={onClick}
      disabled={!selectedEntity}
      className={clsx(
        !selectedEntity && 'opacity-50',
        selectedEntity &&
          'pointer-events-auto cursor-pointer',
        'bg-white text-black rounded-full aspect-square',
        'flex justify-center items-center',
        'w-20 h-20',
      )}
    >
      <span>Mine</span>
    </button>
  )
}
