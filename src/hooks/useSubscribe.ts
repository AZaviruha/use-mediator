import { useEffect } from 'react'
import { useMediator } from 'hooks/useMediator'
import { type Listener } from 'types'

export const useSubscribe = (eventName: string, listenerFn: Listener): void => {
  const { subscribe } = useMediator()

  useEffect(() => {
    return subscribe(eventName, listenerFn)
  }, [subscribe, eventName, listenerFn])
}
