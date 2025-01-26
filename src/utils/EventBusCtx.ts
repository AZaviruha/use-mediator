import { createContext } from 'react'
import createEventBus from 'utils/createEventBus'

const eventBusCTX = createEventBus()
const EventBusCTX = createContext(eventBusCTX)

export default EventBusCTX
