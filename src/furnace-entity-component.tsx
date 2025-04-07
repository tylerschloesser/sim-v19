import React from 'react'

export interface FurnaceEntityComponentProps {}

export const FurnaceEntityComponent = React.memo(
  function FurnaceEntityComponent({}: FurnaceEntityComponentProps) {
    return (
      <svg viewBox={`0 0 1 1`} className="w-full h-full">
        <rect x={0} y={0} width={1} height={1} fill="red" />
      </svg>
    )
  },
)
