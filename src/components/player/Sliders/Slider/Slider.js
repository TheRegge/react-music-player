import React from 'react'
import { connect } from 'react-redux'

import './slider.css'
import SliderBtn from './SliderBtn'
import SliderTrack from './SliderTrack'

const Slider = props => {
  const animClass = props.playStatus === 'PLAYING' ? 'animated' : ''
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

const mapStateToProps = state => ({
  playStatus: state.player.playStatus,
  windowSize: state.window.size
})

export default connect(mapStateToProps)(Slider)
