import {
  type EventBus,
  type Listener,
  type ListenerResult,
  type SkipResult,
  type UnsubscribeFn
} from 'types'

const SKIP_RESULT: SkipResult = '___SPECIAL_RESULT_SKIP___'

const skip = (): SkipResult => SKIP_RESULT

const isSkipResult = (r: ListenerResult): r is SkipResult => {
  return (typeof r === 'string') && (r === SKIP_RESULT)
}

const filterSkippedResults = <TResult>(_results: Array<ListenerResult<TResult>>): TResult[] => {
  const results: TResult[] = []

  for (const r of _results) {
    if (!isSkipResult(r)) {
      results.push(r)
    }
  }

  return results
}

const executeAllInParallel = async <TResult, TPayload>(
  listeners: Array<Listener<TResult, TPayload>>,
  payload: TPayload
): Promise<TResult[]> => {
  const results =
    await Promise.all(listeners.map(async f => await f(payload, skip)))

  return filterSkippedResults(results)
}

/**
 * Creates an event bus that allows sender to await on event handling results.
 */
const createEventBus = (): EventBus => {
  const TASKS_IN_PROGRESS: Record<string, Listener[]> = {}

  const _send = async <TResult, TPayload = null>(
    eventName: string,
    payload: TPayload
  ): Promise<TResult[]> => {
    return await new Promise((resolve, reject) => {
      const listeners =
        (TASKS_IN_PROGRESS[eventName] ?? []) as Array<Listener<TResult, TPayload>>

      try {
        /**
         * TODO: add config if other execution types are needed (race, last, etc).
         */
        return resolve(executeAllInParallel(listeners, payload))
      } catch (err) {
        reject(err)
      }
    })
  }

  const send = async <TResult, TPayload = null>(
    eventName: string,
    payload: TPayload
  ): Promise<TResult[]> => {
    return await _send(eventName, payload /*, config */)
  }

  const subscribe = <TResult, TPayload = null>(
    eventName: string,
    listener: Listener<TResult, TPayload>
  ): UnsubscribeFn => {
    if (!Array.isArray(TASKS_IN_PROGRESS[eventName])) {
      TASKS_IN_PROGRESS[eventName] = []
    }

    TASKS_IN_PROGRESS[eventName].push(listener)

    return () => {
      TASKS_IN_PROGRESS[eventName] = TASKS_IN_PROGRESS[eventName].filter(f => f !== listener)
    }
  }

  return {
    send,
    subscribe
  }
}

export default createEventBus
