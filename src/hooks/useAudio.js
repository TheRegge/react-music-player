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
    
    console.log('Loading audio URL:', url)
    
    // Stop any current playback and reset state
    if (soundRef.current) {
      soundRef.current.stop()
      soundRef.current.unload()
    }
    setPlaying(false)
    setPosition(0)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    const sound = new Howl({
      src: [url],
      format: ['mp3', 'mpeg'],
      volume: volume / 100,
      onload: () => {
        console.log('Audio loaded successfully:', url)
        setLoading(false)
        setDuration(sound.duration() * 1000)
        // If we were supposed to be playing, start now that it's loaded
        if (optionsRef.current.autoPlay) {
          sound.play()
          setPlaying(true)
          
          intervalRef.current = setInterval(() => {
            if (soundRef.current) {
              const pos = soundRef.current.seek() * 1000
              setPosition(pos)
              optionsRef.current.onPlaying?.({ position: pos, duration: sound.duration() * 1000 })
            }
          }, 100)
        }
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
    console.log('Play called, current state:', soundRef.current?.state(), 'playing:', playing)
    
    if (soundRef.current && !playing) {
      console.log('Playing audio:', url)
      // Check if the sound is loaded before trying to play
      if (soundRef.current.state() === 'loaded') {
        soundRef.current.play()
        setPlaying(true)
        optionsRef.current.autoPlay = false // Clear the flag since we're playing now
        
        intervalRef.current = setInterval(() => {
          if (soundRef.current) {
            const pos = soundRef.current.seek() * 1000
            setPosition(pos)
            optionsRef.current.onPlaying?.({ position: pos, duration: duration })
          }
        }, 100)
      } else {
        // If not loaded yet, set a flag to auto-play when it loads
        optionsRef.current.autoPlay = true
        console.log('Audio not ready, will auto-play when loaded')
      }
    } else if (!soundRef.current) {
      // If no sound object yet, set autoPlay for when it's created
      optionsRef.current.autoPlay = true
      console.log('No sound object yet, will auto-play when created')
    }
  }, [playing, duration, url])

  const pause = useCallback(() => {
    if (soundRef.current && playing) {
      soundRef.current.pause()
      setPlaying(false)
      optionsRef.current.autoPlay = false
      
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
      optionsRef.current.autoPlay = false
      
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