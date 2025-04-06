import { useStateObservable } from '@react-rxjs/core'
import clsx from 'clsx'
import { useCallback, useContext } from 'react'
import { ActionButton } from './action-button'
import { AppContext } from './app-context'
import { CursorComponent } from './cursor-component'

export function App() {
  return (
    <>
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

function RobotButton() {
  const { attachedRobotId$, updateState } =
    useContext(AppContext)
  const attachedRobotId = useStateObservable(
    attachedRobotId$,
  )
  const label = attachedRobotId ? 'Detach' : ''

  const onClick = useCallback(() => {
    updateState((draft) => {
      if (!attachedRobotId) {
        return
      }
      draft.attachedRobotId = null
    })
  }, [attachedRobotId, updateState])

  const disabled = !attachedRobotId

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
