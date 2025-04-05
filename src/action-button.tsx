import { useStateObservable } from '@react-rxjs/core'
import clsx from 'clsx'
import { useContext } from 'react'
import { AppContext } from './app-context'

export function ActionButton() {
  const context = useContext(AppContext)
  const selectedEntity = useStateObservable(
    context.selectedEntity$,
  )
  return (
    <button
      onClick={(ev) => {
        console.log(ev)
      }}
      className={clsx(
        !selectedEntity && 'opacity-50',
        selectedEntity && 'pointer-events-auto',
        'bg-white text-black rounded-full aspect-square',
        'flex justify-center items-center',
        'w-20 h-20',
      )}
    >
      <span>Mine</span>
    </button>
  )
}
