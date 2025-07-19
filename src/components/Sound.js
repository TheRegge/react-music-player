import { useEffect, useCallback, useMemo, useRef } from 'react'
import { useAudio } from '../hooks/useAudio'

const Sound = ({ url, playStatus, volume = 100, onLoading, onPlaying, onFinishedPlaying, onError }) => {
  const loadingReportedRef = useRef(false)
  
  // Reset loading reported when URL changes
  useEffect(() => {
    loadingReportedRef.current = false
  }, [url])
  
  const handleError = useCallback((error) => {
    onError?.(0, error.message)
  }, [onError])

  const audioOptions = useMemo(() => ({
    volume,
    onPlaying,
    onFinishedPlaying,
    onError: handleError
  }), [volume, onPlaying, onFinishedPlaying, handleError])

  const audio = useAudio(url, audioOptions)

  useEffect(() => {
    if (audio.loading && onLoading && !loadingReportedRef.current) {
      onLoading({ bytesLoaded: 0, bytesTotal: 100, duration: 0 })
      loadingReportedRef.current = true
    } else if (!audio.loading && audio.duration > 0 && onLoading && loadingReportedRef.current) {
      onLoading({ bytesLoaded: 100, bytesTotal: 100, duration: audio.duration })
      loadingReportedRef.current = false
    }
  }, [audio.loading, audio.duration, onLoading])

  useEffect(() => {
    switch (playStatus) {
      case 'PLAYING':
        audio.play()
        break
      case 'PAUSED':
        audio.pause()
        break
      case 'STOPPED':
        audio.stop()
        break
      default:
        break
    }
  }, [playStatus, audio.play, audio.pause, audio.stop])

  return null
}

Sound.status = {
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
  STOPPED: 'STOPPED'
}

export default Sound