import React, { createContext, useContext, useReducer, useCallback, useMemo, useEffect } from 'react'
import { loadMoodPlaylist, getMoodById, moods } from '../data/moods'
import { RateLimitError } from '../services/jamendoApi'
import { checkRateLimit } from '../utils/rateLimiter'

const PlayerContext = createContext()

const NUMBER_SONGS_PER_TRACK = 10

const initialState = {
  mood: undefined,
  playStatus: 'STOPPED',
  loadingStatus: '',
  trackNumber: 0,
  playingStatus: { position: 0, duration: 0 },
  playlistLoading: false,
  playlistError: null,
  playlistCache: {},
  preloadingComplete: false
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
          action.trackNumber < NUMBER_SONGS_PER_TRACK ? action.trackNumber : 0,
        playingStatus: { position: 0, duration: 0 }, // Reset playing status when changing tracks
        loadingStatus: '' // Reset loading status
      }
    case 'SET_LOADING_STATUS':
      let msg = ''
      
      if (action.loadingStatus.bytesLoaded === 0) {
        msg = 'Loading...'
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
    case 'SET_PLAYLIST_CACHE':
      return {
        ...state,
        playlistCache: action.cache
      }
    case 'SET_PRELOADING_COMPLETE':
      return {
        ...state,
        preloadingComplete: action.complete
      }
    default:
      return state
  }
}

export const PlayerProvider = ({ children }) => {
  const [state, dispatch] = useReducer(playerReducer, initialState)

  // Preload all mood playlists on mount
  useEffect(() => {
    const preloadAllPlaylists = async () => {
      const cache = {}
      const loadPromises = moods.map(async (mood) => {
        try {
          const playlist = await loadMoodPlaylist(mood.id, NUMBER_SONGS_PER_TRACK)
          cache[mood.id] = playlist
        } catch (error) {
          console.error(`Failed to preload ${mood.id} playlist:`, error)
          // Store error info in cache for better error handling
          if (error instanceof RateLimitError) {
            dispatch({ type: 'SET_PLAYLIST_ERROR', error: {
              message: error.message,
              type: 'rate_limit',
              resetIn: error.resetIn
            }})
          }
        }
      })

      await Promise.all(loadPromises)
      dispatch({ type: 'SET_PLAYLIST_CACHE', cache })
      dispatch({ type: 'SET_PRELOADING_COMPLETE', complete: true })
    }

    preloadAllPlaylists()
  }, [])

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

      // Use cached playlist if available
      if (state.playlistCache[mood.id]) {
        mood.playlist = state.playlistCache[mood.id]
        // Set the mood immediately without loading
        dispatch({ type: 'SET_MOOD', mood })
      } else {
        // Fallback to loading if cache miss (shouldn't happen after preload)
        dispatch({ type: 'SET_PLAYLIST_LOADING', loading: true })
        
        const tracks = await loadMoodPlaylist(mood.id || mood.name)
        mood.playlist = tracks
        
        // Update cache with the newly loaded playlist
        const newCache = { ...state.playlistCache, [mood.id]: tracks }
        dispatch({ type: 'SET_PLAYLIST_CACHE', cache: newCache })
        
        // Set the mood with loaded playlist
        dispatch({ type: 'SET_MOOD', mood })
        dispatch({ type: 'SET_PLAYLIST_LOADING', loading: false })
      }
      
    } catch (error) {
      console.error('Error loading mood playlist:', error)
      
      // Handle rate limit errors specifically
      if (error instanceof RateLimitError) {
        dispatch({ type: 'SET_PLAYLIST_ERROR', error: {
          message: error.message,
          type: 'rate_limit',
          resetIn: error.resetIn
        }})
      } else {
        dispatch({ type: 'SET_PLAYLIST_ERROR', error: {
          message: error.message || 'Failed to load playlist',
          type: 'generic'
        }})
      }
      
      dispatch({ type: 'SET_PLAYLIST_LOADING', loading: false })
    }
  }, [state.playlistCache])

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
    preloadingComplete: state.preloadingComplete,
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