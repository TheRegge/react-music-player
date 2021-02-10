import React from 'react'
import { connect } from 'react-redux'
import Loadingbarsvg from './Loadingbarsvg'
import './loadingsong.css'

const Loadingsong = props => {
  const showPlaying =
    props.playStatus === 'PLAYING' || props.playStatus === 'PAUSED'

  // const showLoading = props.playStatus === 'LOADING'

  const makeTime = ms => {
    const timeInSeconds = ms / 1000
    const minutes = Math.round(timeInSeconds / 60).toString()
    const seconds = Math.round(timeInSeconds % 60)
      .toString()
      .padStart(2, '0')
    return `${minutes}:${seconds}`
  }

  let positionStyle = {}
  let p = props.playingStatus.position
  let d = props.playingStatus.duration
  let r = p / d
  let pos = Math.round(260 * r)
  if (!isNaN(r)) {
    // positionStyle = {transform: `translateX(${pos}px)`}
    positionStyle = { width: `${pos}px`, color: '#70B682' }
  }

  let playTime = makeTime(props.playingStatus.position)
  let playTimeLeft = makeTime(
    props.playingStatus.duration - props.playingStatus.position
  )
  return (
    <div className={`loadingsong ${props.windowSize}`}>
      <span aria-label="Loading status" className="loadingStatus">
        {props.loadingStatus}
      </span>
      {showPlaying && (
        <div>
          <div className="playTime">{playTime}</div>
          <div className="playTimeLeft">{playTimeLeft}</div>
          <Loadingbarsvg color="rgba(0, 18, 11, .25)" className="bg" />
          <Loadingbarsvg
            color="#D46A7"
            style={positionStyle}
            className="position"
          />
        </div>
      )}
    </div>
  )
}

const mapStateToProps = state => ({
  loadingStatus: state.player.loadingStatus,
  playStatus: state.player.playStatus,
  playingStatus: state.player.playingStatus,
  windowSize: state.window.size
})

export default connect(mapStateToProps)(Loadingsong)
