import { useContext } from 'react'

import EventBusCTX from 'utils/EventBusCtx'
import { type UseMediatorReturn } from 'types'

/**
 * Hook for inter-component communication.
 * Allows to send event from component Foo to components Bar, Baz etc.
 * Used to solve the use case, when one component needs to trigger
 * some internal logic of other ("smart") components and to get result from them.
 *
 * Usage:
 *
 * On the "emitter" component side:
 * ```
 * const { send } = useMediator()
 *
 * const myHandler = async () => {
 *   const results: T[] = await send<T>(EVENT_NAME, payload)
 *   // ...
 * }
 * ```
 *
 * On the "listeners" component side:
 * ```
 * const { subscribe } = useMediator()
 *
 * useEffect(() => {
 *   const unsub = subscribe(EVENT_NAME, async <TRes, TData>(payload: TData, skip) => {
 *     return result
 *   })
 *
 *   return unsub
 * }, [subscribe])
 * ```
 *
 * Also, consider to use `useSubscribe` on the listeners' side, as convenient shortcut:
 * ```
 * useSubscribe(EVENT_NAME, async <TRes, TData>(payload: TData, skip) => {
 *   return result
 * })
 * ```
 */
export const useMediator = (): UseMediatorReturn => {
  return useContext(EventBusCTX)
}
