export type SkipResult = '___SPECIAL_RESULT_SKIP___'

export type ListenerResult<TResult = unknown> = TResult | SkipResult

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Listener<TResult = any, TPayload = any> =
  (data: TPayload, skip: () => SkipResult) => Promise<ListenerResult<TResult>>

export type UnsubscribeFn = () => void

export interface EventBus {
  send: <TResult, TPayload = null>(eventName: string, payload: TPayload) => Promise<TResult[]>
  subscribe: <TResult, TPayload = null>(eventName: string, listener: Listener<TResult, TPayload>) => UnsubscribeFn
}

export interface UseMediatorReturn {
  send: <TResponse, TRequest = null>(eventName: string, data: TRequest) => Promise<TResponse[]>
  subscribe: <TResult, TPayload = null>(eventName: string, listener: Listener<TResult, TPayload>) => UnsubscribeFn
}
