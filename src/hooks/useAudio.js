import { useEffect, useRef, useState, useCallback } from 'react'
import { Howl } from 'howler'

export const useAudio = (url, options = {}) => {
  const [loading, setLoading] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [position, setPosition] = useState(0)
  const [volume, setVolume] = useState(options.volume || 20)
  const soundRef = useRef(null)
  const intervalRef = useRef(null)
  const optionsRef = useRef(options)

  // Update options ref when they change
  useEffect(() => {
    optionsRef.current = options
  }, [options])

  useEffect(() => {
    if (!url) return

    const sound = new Howl({
      src: [url],
      volume: volume / 100,
      onload: () => {
        setLoading(false)
        setDuration(sound.duration() * 1000)
      },
      onloaderror: (id, error) => {
        console.error('Load error for URL:', url, 'Error:', error)
        setLoading(false)
        optionsRef.current.onError?.(error)
      },
      onplayerror: (id, error) => {
        console.error('Play error:', error)
        optionsRef.current.onError?.(error)
      },
      onend: () => {
        setPlaying(false)
        setPosition(0)
        optionsRef.current.onFinishedPlaying?.()
      }
    })

    soundRef.current = sound
    setLoading(true)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      sound.unload()
    }
  }, [url, volume])

  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.volume(volume / 100)
    }
  }, [volume])

  const play = useCallback(() => {
    if (soundRef.current && !playing) {
      soundRef.current.play()
      setPlaying(true)
      
      intervalRef.current = setInterval(() => {
        if (soundRef.current) {
          const pos = soundRef.current.seek() * 1000
          setPosition(pos)
          optionsRef.current.onPlaying?.({ position: pos, duration: duration })
        }
      }, 100)
    }
  }, [playing, duration])

  const pause = useCallback(() => {
    if (soundRef.current && playing) {
      soundRef.current.pause()
      setPlaying(false)
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [playing])

  const stop = useCallback(() => {
    if (soundRef.current) {
      soundRef.current.stop()
      setPlaying(false)
      setPosition(0)
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  return {
    play,
    pause,
    stop,
    playing,
    loading,
    duration,
    position,
    volume,
    setVolume
  }
}