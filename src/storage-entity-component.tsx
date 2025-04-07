import React from 'react'

export interface StorageEntityComponentProps {}

export const StorageEntityComponent = React.memo(
  function StorageEntityComponent({}: StorageEntityComponentProps) {
    return (
      <svg viewBox={`0 0 1 1`} className="w-full h-full">
        <rect
          x={0}
          y={0}
          width={1}
          height={1}
          fill="green"
        />
      </svg>
    )
  },
)
