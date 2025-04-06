import { useStateObservable } from '@react-rxjs/core'
import clsx from 'clsx'
import React, { Fragment, useContext, useRef } from 'react'
import {
  combineLatest,
  distinctUntilChanged,
  map,
  takeUntil,
} from 'rxjs'
import invariant from 'tiny-invariant'
import { AppContext } from './app-context'
import { useEffectWithDestroy } from './use-effect-with-destroy'

export interface RobotComponentProps {
  robotId: string
}

export const RobotComponent = React.memo(
  function RobotComponent({
    robotId,
  }: RobotComponentProps) {
    const ref = useRef<HTMLDivElement>(null)
    const {
      getRobot$,
      getRobotInventory$,
      getRobotTask$,
      scale$,
    } = useContext(AppContext)

    const inventory = useStateObservable(
      getRobotInventory$(robotId),
    )

    const task = useStateObservable(getRobotTask$(robotId))

    useEffectWithDestroy(
      (destroy$) => {
        const robot$ = getRobot$(robotId)
        const radius$ = robot$.pipe(
          map((robot) => robot.radius),
          distinctUntilChanged(),
        )
        combineLatest([radius$, scale$])
          .pipe(takeUntil(destroy$))
          .subscribe(([radius, scale]) => {
            invariant(ref.current)
            ref.current.style.width = `${radius * 2 * scale}px`
            ref.current.style.height = `${radius * 2 * scale}px`
            ref.current.style.top = `${-radius * scale}px`
            ref.current.style.left = `${-radius * scale}px`
          })
      },
      [getRobot$],
    )

    useEffectWithDestroy(
      (destroy$) => {
        const robot$ = getRobot$(robotId)
        const position$ = robot$.pipe(
          map((robot) => robot.position),
          distinctUntilChanged(),
        )
        combineLatest([position$, scale$])
          .pipe(takeUntil(destroy$))
          .subscribe(([position, scale]) => {
            invariant(ref.current)
            const { x, y } = position
            ref.current.style.transform = `translate(${x * scale}px, ${y * scale}px)`
          })
      },
      [getRobot$],
    )

    return (
      <div
        data-robot-id={robotId}
        className="absolute border border-white rounded-full"
        ref={ref}
      >
        <div
          className={clsx(
            'absolute left-0 bottom-full',
            'text-white',
            'pointer-events-none',
            'text-nowrap',
          )}
        >
          <div
            className={clsx(
              'grid grid-cols-2 gap-1',
              'items-center',
              'font-mono text-xs',
            )}
          >
            {Object.entries(inventory).map(
              ([color, count]) => (
                <Fragment key={color}>
                  <div
                    style={{
                      backgroundColor: color,
                    }}
                    className={clsx('w-4 h-4 rounded-full')}
                  ></div>
                  <div>{count}</div>
                </Fragment>
              ),
            )}
          </div>
        </div>
        {task && (
          <div
            className={clsx(
              'absolute left-full top-full',
              'text-white',
              'pointer-events-none',
              'text-nowrap',
            )}
          >
            {task.type}
          </div>
        )}
      </div>
    )
  },
)
