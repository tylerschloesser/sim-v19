import React from 'react'

export type WorldComponentProps =
  React.PropsWithChildren<{}>

export function WorldComponent({
  children,
}: WorldComponentProps) {
  return <>{children}</>
}
