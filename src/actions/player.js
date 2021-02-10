import { getMood } from '../data/moods'

// SET_MOOD
export const setMood = mood => ({
  type: 'SET_MOOD',
  mood: getMood(mood)
})

// SET_PLAY_STATUS ('PLAYING', 'STOPPED', 'PAUSED')
export const setPlayStatus = status => ({
  type: 'SET_PLAY_STATUS',
  playStatus: status
})

// SET_PLAYING_STATUS ({position, duration})
export const setPlayingStatus = status => ({
  type: 'SET_PLAYING_STATUS',
  playingStatus: status
})

// SET_TRACK_NUMBER (Number)
export const setTrackNumber = trackNumber => ({
  type: 'SET_TRACK_NUMBER',
  trackNumber
})

// SET_LOADING_STATUS ({bytesLoaded, bytesTotal, duration})
export const setLoadingStatus = loadingStatus => ({
  type: 'SET_LOADING_STATUS',
  loadingStatus
})
