import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react'
import { loadMoodPlaylist, getMoodById } from '../data/moods'

const PlayerContext = createContext()

const NUMBER_SONGS_PER_TRACK = 10

const initialState = {
  mood: undefined,
  playStatus: 'STOPPED',
  loadingStatus: '',
  trackNumber: 0,
  playingStatus: { position: 0, duration: 0 },
  playlistLoading: false,
  playlistError: null
}

const playerReducer = (state, action) => {
  switch (action.type) {
    case 'SET_MOOD':
      return {
        ...state,
        mood: action.mood,
        trackNumber: 0, // Reset to first track when mood changes
        playStatus: 'STOPPED'
      }
    case 'SET_PLAYLIST_LOADING':
      return {
        ...state,
        playlistLoading: action.loading,
        playlistError: action.loading ? null : state.playlistError
      }
    case 'SET_PLAYLIST_ERROR':
      return {
        ...state,
        playlistError: action.error,
        playlistLoading: false
      }
    case 'SET_PLAY_STATUS':
      return {
        ...state,
        playStatus: action.playStatus
      }
    case 'SET_PLAYING_STATUS':
      // Only return new state if position or duration actually changed
      if (state.playingStatus.position === action.playingStatus.position &&
          state.playingStatus.duration === action.playingStatus.duration) {
        return state
      }
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
      
      // Only return new state if the message actually changed
      if (msg === state.loadingStatus) {
        return state
      }
      
      return {
        ...state,
        loadingStatus: msg
      }
    default:
      return state
  }
}

export const PlayerProvider = ({ children }) => {
  const [state, dispatch] = useReducer(playerReducer, initialState)

  const setMood = useCallback(async (moodData) => {
    try {
      // If moodData is a string (mood name), convert to mood object
      let mood
      if (typeof moodData === 'string') {
        const moodDef = getMoodById(moodData)
        if (!moodDef) {
          throw new Error(`Unknown mood: ${moodData}`)
        }
        mood = { ...moodDef }
      } else {
        mood = { ...moodData }
      }

      // Start loading
      dispatch({ type: 'SET_PLAYLIST_LOADING', loading: true })
      
      // Load playlist from Jamendo if not already loaded
      if (!mood.playlist) {
        const tracks = await loadMoodPlaylist(mood.id || mood.name)
        mood.playlist = tracks
      }
      
      // Set the mood with loaded playlist
      dispatch({ type: 'SET_MOOD', mood })
      dispatch({ type: 'SET_PLAYLIST_LOADING', loading: false })
      
    } catch (error) {
      console.error('Error loading mood playlist:', error)
      dispatch({ type: 'SET_PLAYLIST_ERROR', error: error.message })
    }
  }, [])

  const setPlayStatus = useCallback((playStatus) => {
    dispatch({ type: 'SET_PLAY_STATUS', playStatus })
  }, [])

  const setTrackNumber = useCallback((trackNumber) => {
    dispatch({ type: 'SET_TRACK_NUMBER', trackNumber })
  }, [])

  const setLoadingStatus = useCallback((loadingStatus) => {
    dispatch({ type: 'SET_LOADING_STATUS', loadingStatus })
  }, [])

  const setPlayingStatus = useCallback((playingStatus) => {
    dispatch({ type: 'SET_PLAYING_STATUS', playingStatus })
  }, [])

  const value = useMemo(() => ({
    ...state,
    mood: state.mood ? state.mood.name : undefined,
    playlist: state.mood ? state.mood.playlist : undefined,
    moodObject: state.mood,
    playlistLoading: state.playlistLoading,
    playlistError: state.playlistError,
    setMood,
    setPlayStatus,
    setTrackNumber,
    setLoadingStatus,
    setPlayingStatus
  }), [state, setMood, setPlayStatus, setTrackNumber, setLoadingStatus, setPlayingStatus])

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  )
}

export const usePlayer = () => {
  const context = useContext(PlayerContext)
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider')
  }
  return context
}