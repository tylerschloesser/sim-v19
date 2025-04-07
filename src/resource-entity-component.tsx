import { useStateObservable } from '@react-rxjs/core'
import React, { useContext } from 'react'
import { AppContext } from './app-context'

export interface ResourceEntityComponentProps {
  color: string
}

export const ResourceEntityComponent = React.memo(
  function ResourceEntityComponent({
    color,
  }: ResourceEntityComponentProps) {
    const { scale$ } = useContext(AppContext)
    const scale = useStateObservable(scale$)

    const rects: { x: number; y: number }[] = []

    const GRID_SIZE = 6
    for (let x = 0; x < GRID_SIZE; x++) {
      for (let y = 0; y < GRID_SIZE; y++) {
        switch (x % 2) {
          case 0:
            if (y % 2 === 0) {
              rects.push({ x, y })
            }
            break
          case 1:
            if (y % 2 === 1) {
              rects.push({ x, y })
            }
            break
        }
      }
    }

    return (
      <svg
        viewBox={`0 0 ${scale} ${scale}`}
        className="w-full h-full"
      >
        {rects.map(({ x, y }, i) => (
          <rect
            key={i}
            x={x * (scale / GRID_SIZE)}
            y={y * (scale / GRID_SIZE)}
            width={scale / GRID_SIZE}
            height={scale / GRID_SIZE}
            fill={color}
          />
        ))}
      </svg>
    )
  },
)
