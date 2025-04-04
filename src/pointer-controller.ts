import { Subject } from 'rxjs'
import invariant from 'tiny-invariant'
import { Vec2 } from './vec2'

export class PointerController {
  private abortController: AbortController

  public drag$: Subject<Vec2> = new Subject<Vec2>()

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
          this.pointerIdToEventLog.delete(ev.pointerId)
        }
      },
      { signal },
    )
  }
}
