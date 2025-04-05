import { useStateObservable } from '@react-rxjs/core'
import clsx from 'clsx'
import { useContext } from 'react'
import { AppContext } from './app-context'

export function ActionButton() {
  const context = useContext(AppContext)
  const selectedEntityId = useStateObservable(
    context.selectedEntityId$,
  )
  return (
    <button
      onClick={(ev) => {
        console.log(ev)
      }}
      className={clsx(
        !selectedEntityId && 'opacity-50',
        selectedEntityId && 'pointer-events-auto',
        'bg-white text-black rounded-full aspect-square',
        'flex justify-center items-center',
        'w-20 h-20',
      )}
    >
      <span>Mine</span>
    </button>
  )
}
