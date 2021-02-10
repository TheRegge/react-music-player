// import { bindActionCreators } from 'redux'

const playerReducerDefaultState = {
  mood: undefined,
  playStatus: 'STOPPED',
  loadingStatus: '',
  trackNumber: 0,
  playingStatus: { position: 0, duration: 0 }
}

const NUMBER_SONGS_PER_TRACK = 8

export default (state = playerReducerDefaultState, action) => {
  console.log('action', action)
  switch (action.type) {
    case 'SET_MOOD':
      return {
        ...state,
        mood: action.mood
      }
    case 'SET_PLAY_STATUS':
      return {
        ...state,
        playStatus: action.playStatus
      }
    case 'SET_PLAYING_STATUS':
      return {
        ...state,
        playingStatus: action.playingStatus
      }
    case 'SET_TRACK_NUMBER':
      return {
        ...state,
        trackNumber:
          action.trackNumber < NUMBER_SONGS_PER_TRACK ? action.trackNumber : 0
      }
    case 'SET_LOADING_STATUS':
      let msg = ''

      if (action.loadingStatus.bytesLoaded === 0) {
        msg = ''
      } else if (action.loadingStatus.bytesLoaded > 0) {
        const bytes =
          action.loadingStatus.bytesTotal / action.loadingStatus.bytesLoaded
        msg =
          bytes > 1
            ? `Buffering ${Math.ceil(100 / bytes)}%`
            : 'Song Fully Loaded'
      }
      return {
        ...state,
        loadingStatus: msg
      }

    default:
      return state
  }
}
