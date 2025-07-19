import React from 'react'
import { usePlayer } from '../../../../contexts/PlayerContext'
import { useWindow } from '../../../../contexts/WindowContext'
import Loadingbarsvg from './Loadingbarsvg'
import './loadingsong.css'

const Loadingsong = () => {
  const { loadingStatus, playStatus, playingStatus, trackNumber, moodObject } = usePlayer()
  const { size: windowSize } = useWindow()
  
  const showPlaying =
    playStatus === 'PLAYING' || playStatus === 'PAUSED'

  // Check if song is loading: either explicit loading status or when we have play status but no duration yet
  const isLoading = (loadingStatus && loadingStatus !== 'Song Fully Loaded' && loadingStatus !== '') || 
                   (showPlaying && (!playingStatus.duration || playingStatus.duration === 0))

  const makeTime = ms => {
    const timeInSeconds = ms / 1000
    const minutes = Math.round(timeInSeconds / 60).toString()
    const seconds = Math.round(timeInSeconds % 60)
      .toString()
      .padStart(2, '0')
    return `${minutes}:${seconds}`
  }

  let positionStyle = {}
  let p = playingStatus.position
  let d = playingStatus.duration
  let r = p / d
  let pos = Math.round(260 * r)
  if (!isNaN(r)) {
    // positionStyle = {transform: `translateX(${pos}px)`}
    positionStyle = { width: `${pos}px`, color: '#70B682' }
  }

  let playTime = makeTime(playingStatus.position)
  let playTimeLeft = makeTime(
    playingStatus.duration - playingStatus.position
  )
  return (
    <div className={`loadingsong ${windowSize}`}>
      <span aria-label="Loading status" className="loadingStatus">
        {loadingStatus}
      </span>
      {showPlaying && (
        <div>
          <div className="playTime">{playTime}</div>
          <div className="playTimeLeft">{playTimeLeft}</div>
          <Loadingbarsvg color="rgba(0, 18, 11, .25)" className="bg" />
          <Loadingbarsvg
            key={`progress-${moodObject?.name}-${trackNumber}`}
            color="#D46A7"
            style={isLoading ? {} : positionStyle}
            className={`position ${isLoading ? 'loading' : ''}`}
          />
        </div>
      )}
    </div>
  )
}

export default Loadingsong
