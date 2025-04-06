import { useStateObservable } from '@react-rxjs/core'
import clsx from 'clsx'
import { useContext } from 'react'
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
  const context = useContext(AppContext)
  const attachedRobotId = useStateObservable(
    context.attachedRobotId$,
  )
  const label = attachedRobotId ? 'Detach' : ''
  return (
    <div
      className={clsx(
        'w-16 h-16 rounded-full bg-white',
        'flex justify-center items-center',
        'text-xs',
        !attachedRobotId && 'opacity-50',
      )}
    >
      {label}
    </div>
  )
}

function TbdButton() {
  return (
    <div
      className={clsx(
        'w-16 h-16 rounded-full bg-white',
        'flex justify-center items-center',
        'text-xs',
      )}
    >
      Tbd
    </div>
  )
}
