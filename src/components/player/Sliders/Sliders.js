import React from 'react'
import { usePlayer } from '../../../contexts/PlayerContext'
import { useAudioAnalyzer } from '../../../hooks/useAudioAnalyzer'

import Slider from './Slider/Slider'

const Sliders = () => {
  const { playStatus } = usePlayer()
  const isPlaying = playStatus === 'PLAYING'
  const frequencyData = useAudioAnalyzer(isPlaying)
  
  // Debug frequency data (commented out for production)
  // if (isPlaying && (frequencyData.bass > 0 || frequencyData.mid > 0 || frequencyData.treble > 0)) {
  //   console.log('Sliders - Frequency data:', frequencyData)
  // }
  
  const top = 14
  const spacing = 22

  return (
    <>
      <Slider 
        top={top} 
        right={29} 
        position="top" 
        color="#E65454" 
        amplitude={frequencyData.bass}
      />
      <Slider
        top={top + spacing}
        right={29}
        position="middle"
        color="#EAB653"
        amplitude={frequencyData.mid}
      />
      <Slider
        top={top + spacing * 2}
        right={29}
        position="bottom"
        color="#5EA65E"
        amplitude={frequencyData.treble}
      />
    </>
  )
}

export default Sliders
