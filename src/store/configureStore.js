import { createStore } from 'redux'
import rootReducer from '../reducers/rootReducer'

export default () => {
  const store = createStore(rootReducer)
  return store
}
