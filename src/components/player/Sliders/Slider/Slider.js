import React from 'react'
import { usePlayer } from '../../../../contexts/PlayerContext'

import './slider.css'
import SliderBtn from './SliderBtn'
import SliderTrack from './SliderTrack'

const Slider = props => {
  const { playStatus } = usePlayer()
  const isPlaying = playStatus === 'PLAYING'
  
  // Use frequency-based positioning when playing, otherwise default position
  const translateX = isPlaying && props.amplitude !== undefined 
    ? Math.round((props.amplitude / 255) * 150) // Map 0-255 to 0-150px
    : 0
    
  const style = {
    top: `${props.top}px`,
    right: `${props.right}px`
  }
  
  const btnStyle = {
    transform: `translateX(${translateX}px)`,
    transition: isPlaying ? 'transform 100ms cubic-bezier(0.4, 0.0, 0.2, 1)' : 'transform 300ms ease-out'
  }

  return (
    <div className="slider" style={style}>
      <SliderBtn
        className={`sliderBtn ${props.position}`}
        color={props.color}
        style={btnStyle}
      />
      <SliderTrack />
    </div>
  )
}

export default Slider
