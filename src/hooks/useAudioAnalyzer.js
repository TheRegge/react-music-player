import { useEffect, useRef, useState, useCallback } from 'react'
import { Howler, Howl } from 'howler'

export const useAudioAnalyzer = (playing) => {
  const [frequencyData, setFrequencyData] = useState({ bass: 0, mid: 0, treble: 0 })
  const analyzerRef = useRef(null)
  const dataArrayRef = useRef(null)
  const animationIdRef = useRef(null)
  
  // Peak hold and decay settings for VU meter behavior
  const DECAY_RATE = 0.94 // How quickly levels decay (0.94 = 6% decay per frame)
  const PEAK_SENSITIVITY = 1.05 // Multiplier for detecting new peaks (lower = more sensitive)
  const MIN_DECAY = 0.5 // Minimum decay per frame to prevent sticking
  
  const currentLevelsRef = useRef({ bass: 0, mid: 0, treble: 0 })
  
  const analyze = useCallback(() => {
    if (!analyzerRef.current || !dataArrayRef.current) return
    
    analyzerRef.current.getByteFrequencyData(dataArrayRef.current)
    
    // Check if we're getting any data (commented out for production)
    // const maxValue = Math.max(...dataArrayRef.current)
    // if (maxValue > 0) {
    //   console.log('Audio Analyzer - Max frequency value:', maxValue)
    // }
    
    // FFT size of 2048 gives us 1024 frequency bins
    // Sample rate is typically 44100 Hz
    // Each bin represents ~43 Hz (44100 / 2048)
    
    // Bass: 20-250 Hz (bins 0-6)
    let bassSum = 0
    for (let i = 0; i < 6; i++) {
      bassSum += dataArrayRef.current[i]
    }
    const bassAvg = bassSum / 6
    
    // Mid: 250-4000 Hz (bins 6-93)
    let midSum = 0
    for (let i = 6; i < 93; i++) {
      midSum += dataArrayRef.current[i]
    }
    const midAvg = midSum / 87
    
    // Treble: 4000-20000 Hz (bins 93-465)
    let trebleSum = 0
    for (let i = 93; i < 465; i++) {
      trebleSum += dataArrayRef.current[i]
    }
    const trebleAvg = trebleSum / 372
    
    // VU meter behavior: fast attack, slow decay
    const processLevel = (newLevel, currentLevel) => {
      // If new level is higher than current, jump up immediately (fast attack)
      if (newLevel > currentLevel * PEAK_SENSITIVITY) {
        return newLevel
      }
      // Otherwise, decay slowly (slow release)
      else {
        const decayedLevel = currentLevel * DECAY_RATE
        // Ensure minimum decay to prevent sticking
        return Math.max(newLevel, decayedLevel - MIN_DECAY)
      }
    }
    
    // Apply VU meter behavior to each frequency band
    const vuBass = processLevel(bassAvg, currentLevelsRef.current.bass)
    const vuMid = processLevel(midAvg, currentLevelsRef.current.mid)
    const vuTreble = processLevel(trebleAvg, currentLevelsRef.current.treble)
    
    // Clamp values to valid range
    const clampedBass = Math.max(0, Math.min(255, vuBass))
    const clampedMid = Math.max(0, Math.min(255, vuMid))
    const clampedTreble = Math.max(0, Math.min(255, vuTreble))
    
    currentLevelsRef.current = { bass: clampedBass, mid: clampedMid, treble: clampedTreble }
    
    setFrequencyData({
      bass: clampedBass,
      mid: clampedMid,
      treble: clampedTreble
    })
    
    if (playing) {
      animationIdRef.current = requestAnimationFrame(analyze)
    }
  }, [playing])
  
  useEffect(() => {
    // Get Howler's Web Audio context
    let ctx = Howler.ctx
    
    // If context doesn't exist yet, try to create it
    if (!ctx && playing) {
      // Force context creation by playing a silent buffer
      const silentSound = new Howl({
        src: ['data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA'],
        volume: 0
      })
      silentSound.play()
      silentSound.stop()
      ctx = Howler.ctx
    }
    
    // console.log('Audio Analyzer - Context:', ctx, 'Playing:', playing)
    
    if (ctx && playing) {
      // Create analyzer node
      const analyzer = ctx.createAnalyser()
      analyzer.fftSize = 2048
      analyzer.smoothingTimeConstant = 0.7 // Reduced for more responsive analysis
      
      // Disconnect and reconnect the audio graph to insert analyzer
      // Get the destination (speakers)
      const destination = ctx.destination
      
      // Disconnect master gain from destination
      Howler.masterGain.disconnect()
      
      // Connect master gain -> analyzer -> destination
      Howler.masterGain.connect(analyzer)
      analyzer.connect(destination)
      
      // console.log('Audio Analyzer - Connected: masterGain -> analyzer -> destination')
      
      // Create data array for frequency data
      const bufferLength = analyzer.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)
      
      analyzerRef.current = analyzer
      dataArrayRef.current = dataArray
      
      // Start analyzing
      analyze()
    }
    
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      
      // Restore original audio connections
      if (analyzerRef.current && ctx) {
        Howler.masterGain.disconnect()
        Howler.masterGain.connect(ctx.destination)
        analyzerRef.current = null
      }
      
      // Reset frequency data when not playing
      if (!playing) {
        setFrequencyData({ bass: 0, mid: 0, treble: 0 })
        currentLevelsRef.current = { bass: 0, mid: 0, treble: 0 }
      }
    }
  }, [playing, analyze])
  
  return frequencyData
}