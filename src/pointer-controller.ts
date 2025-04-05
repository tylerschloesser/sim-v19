import { Subject } from 'rxjs'
import invariant from 'tiny-invariant'
import { Vec2 } from './vec2'

export class PointerController {
  private abortController: AbortController

  public drag$: Subject<Vec2> = new Subject<Vec2>()
  public release$: Subject<Vec2> = new Subject<Vec2>()

  private pointerIdToEventLog: Map<number, PointerEvent[]> =
    new Map()

  constructor(container: HTMLElement) {
    this.abortController = new AbortController()
    const { signal } = this.abortController

    container.addEventListener(
      'pointerdown',
      (ev) => {
        if (this.pointerIdToEventLog.size === 0) {
          this.pointerIdToEventLog.set(ev.pointerId, [])
        }
      },
      {
        signal,
      },
    )

    document.addEventListener(
      'pointermove',
      (ev) => {
        const log = this.pointerIdToEventLog.get(
          ev.pointerId,
        )
        if (!log) {
          return
        }

        log.push(ev)

        if (log.length < 2) {
          return
        }

        const [prev, curr] = log.slice(-2)
        invariant(prev)
        invariant(curr)

        const dx = curr.clientX - prev.clientX
        const dy = curr.clientY - prev.clientY

        this.drag$.next(new Vec2(dx, dy))
      },
      { signal },
    )

    document.addEventListener(
      'pointerup',
      (ev) => {
        const log = this.pointerIdToEventLog.get(
          ev.pointerId,
        )
        if (log) {
          if (log.length >= 2) {
            const releaseWindow: {
              dx: number
              dy: number
              dt: number
            }[] = []

            const reverseLog = log.slice().reverse()

            let next = reverseLog.at(0)!
            invariant(next)
            let prev = reverseLog.at(1)
            invariant(prev)
            let index = 2

            while (
              prev &&
              ev.timeStamp - prev.timeStamp < 100
            ) {
              const dx = next.clientX - prev.clientX
              const dy = next.clientY - prev.clientY
              const dt =
                (next.timeStamp - prev.timeStamp) / 1000
              invariant(dt > 0)

              releaseWindow.push({ dx, dy, dt })

              next = prev
              prev = reverseLog.at(index++)
            }

            if (releaseWindow.length > 0) {
              const average = releaseWindow.reduce(
                (acc, curr) => ({
                  dx: acc.dx + curr.dx,
                  dy: acc.dy + curr.dy,
                  dt: acc.dt + curr.dt,
                }),
                { dx: 0, dy: 0, dt: 0 },
              )
              this.release$.next(
                new Vec2(average.dx, average.dy).div(
                  average.dt,
                ),
              )
            }
          }

          this.pointerIdToEventLog.delete(ev.pointerId)
        }
      },
      { signal },
    )
  }
}
