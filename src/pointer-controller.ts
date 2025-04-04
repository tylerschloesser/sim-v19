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

    container.addEventListener(
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

    container.addEventListener(
      'pointerup',
      (ev) => {
        const log = this.pointerIdToEventLog.get(
          ev.pointerId,
        )
        if (log) {
          if (log.length) {
            const lastTen: Vec2[] = []

            for (
              let i = 0;
              i < Math.min(11, log.length - 1);
              i++
            ) {
              const prev = log[log.length - 1 - i]
              const next = log[log.length - 1 - i - 1]

              invariant(prev)
              invariant(next)

              const dx = prev.clientX - next.clientX
              const dy = prev.clientY - next.clientY

              lastTen.push(new Vec2(dx, dy))
            }

            const average = lastTen
              .reduce(
                (acc, curr) => acc.add(curr),
                Vec2.ZERO,
              )
              .div(lastTen.length)
            this.release$.next(average)
          }

          this.pointerIdToEventLog.delete(ev.pointerId)
        }
      },
      { signal },
    )
  }
}
