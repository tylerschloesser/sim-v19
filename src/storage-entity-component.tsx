import React from 'react'

export interface StorageEntityComponentProps {
  inventory: Record<string, number>
}

export const StorageEntityComponent = React.memo(
  function StorageEntityComponent({
    inventory,
  }: StorageEntityComponentProps) {
    return (
      <div
        className="w-full h-full flex justify-center items-center"
        style={{ background: 'green' }}
      >
        <div className="grid grid-cols-2 gap-1">
          {Object.entries(inventory).map(
            ([color, count]) => (
              <React.Fragment key={color}>
                <div
                  style={{
                    backgroundColor: color,
                  }}
                  className="w-4 h-4 rounded-full"
                ></div>
                <div>{count}</div>
              </React.Fragment>
            ),
          )}
        </div>
      </div>
    )
  },
)
