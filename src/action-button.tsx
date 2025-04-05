import clsx from 'clsx'

export function ActionButton() {
  return (
    <button
      onClick={(ev) => {
        console.log(ev)
      }}
      className={clsx(
        'pointer-events-auto',
        'bg-white text-black rounded-full aspect-square',
        'flex justify-center items-center',
        'w-20 h-20',
      )}
    >
      <span>Mine</span>
    </button>
  )
}
