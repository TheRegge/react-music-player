import { combineReducers } from 'redux'
import playerReducer from './player'
import windowReducer from './window'

export default combineReducers({
  player: playerReducer,
  window: windowReducer
})
