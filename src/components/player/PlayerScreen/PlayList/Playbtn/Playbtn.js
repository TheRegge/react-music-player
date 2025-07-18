import React from 'react'
import { usePlayer } from '../../../../../contexts/PlayerContext'
import './playbtn.css'
import Playbtnsvg from './PlayBtnsvg'
import Pausebtnsvg from './PauseBtnsvg'

const PlayBtn = ({ index }) => {
  const { playStatus, trackNumber } = usePlayer()
  
  // Get the button 'playing' status
  const playing =
    trackNumber === index &&
    playStatus === 'PLAYING'
    
  return (
    <div className="playBtn">
      {!playing && <Playbtnsvg width="18px" height="18px"></Playbtnsvg>}
      {playing && <Pausebtnsvg width="18px" height="18px"></Pausebtnsvg>}
    </div>
  )
}

export default PlayBtn
