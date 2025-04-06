import { ActionButton } from './action-button'
import { CursorComponent } from './cursor-component'

export function App() {
  return (
    <>
      <div className="absolute bottom-0 w-full flex justify-center">
        <div className="p-8">
          <ActionButton />
        </div>
      </div>
      <CursorComponent />
    </>
  )
}
