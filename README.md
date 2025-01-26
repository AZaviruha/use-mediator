# UseMediator

A small hook for inter-component communication.
Allows to send event from component Foo to components Bar, Baz etc.
Used to solve the use case, when one component needs to trigger
some internal logic of other ("smart") components and to get result from them.

In line with modern trends that are gaining popularity, `useMediator` makes
is easier to implement "local-first" smart components, with a minimal amount of shared state.

## Example

```ts
// Foo.ts
import { useMediator } from 'use-mediator'

const FooComponent = () => {
  const { send } = useMediator()
  
  const myHandler = async () => {
    const result = await send<PayloadType>(Events.GetBarStatus, payload)
    // ...
  }
  
  // ...
}
```

```ts
// Bar.ts
import { useSubscribe } from 'use-mediator'

const BarComponent = () => {
  const { subscribe } = useMediator()
  
  /**
   * Some heavy logic that is mostly needed inside `BarComponent`
   */
  const loadFreshStatus = async (): Promise<ResultType> => {
    /*... */
  }

  useSubscribe(EVENT_NAME, async <ResultType, PayloadType>(payload, skip) => {
    const result = await loadFreshStatus({ ...internalState, ...payload })
    return result
  })

  // ...
}
```

This pattern allows you to avoid moving handlers (and state) that is used by two
and more components to the parent, avoiding unnecessary re-renders or memoizations.