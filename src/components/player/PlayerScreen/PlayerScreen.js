import React from 'react'
import { usePlayer } from '../../../contexts/PlayerContext'
import { useWindow } from '../../../contexts/WindowContext'
import Loadingsong from './Loadingsong/Loadingsong'
import PlayList from './PlayList/PlayList'
import ScreenBgLg from './ScreenBgLg'
import './playerScreen.css'

function PlayerScreen() {
  const { moodObject } = usePlayer()
  const { size: windowSize } = useWindow()
  
  let message = 'Select a playlist with the buttons on the right!'

  return (
    <div className={`playerScreen ${windowSize}`}>
      {/* SCREEN BACKGROUND */}
      <ScreenBgLg className={`screenBackground ${windowSize}`}></ScreenBgLg>

      {/* LOADING/PLAY POSITION VISUALIZER */}
      <Loadingsong />

      {/* PLAYLIST */}
      {moodObject && <PlayList />}

      {/* SCREEN MESSAGE BEFORE PLAYSLIST IS CHOSEN */}
      {!moodObject && (
        <p className={`screenMessage ${windowSize}`}>{message}</p>
      )}
    </div>
  )
}

export default PlayerScreen
