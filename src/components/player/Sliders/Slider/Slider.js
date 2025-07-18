import React from 'react'
import { usePlayer } from '../../../../contexts/PlayerContext'

import './slider.css'
import SliderBtn from './SliderBtn'
import SliderTrack from './SliderTrack'

const Slider = props => {
  const { playStatus } = usePlayer()
  const animClass = playStatus === 'PLAYING' ? 'animated' : ''
  const style = {
    top: `${props.top}px`,
    right: `${props.right}px`
  }

  return (
    <div className="slider" style={style}>
      <SliderBtn
        className={`sliderBtn ${props.position} ${animClass}`}
        color={props.color}
      />
      <SliderTrack />
    </div>
  )
}

export default Slider
