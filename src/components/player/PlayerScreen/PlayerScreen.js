import React from 'react'
import { connect } from 'react-redux'
import Loadingsong from './Loadingsong/Loadingsong'
import PlayList from './PlayList/PlayList'
import ScreenBgLg from './ScreenBgLg'
import './playerScreen.css'

function PlayerScreen({ playerMood, windowSize }) {
  let message = 'Select a playlist with the buttons on the right!'

  return (
    <div className={`playerScreen ${windowSize}`}>
      {/* SCREEN BACKGROUND */}
      <ScreenBgLg className={`screenBackground ${windowSize}`}></ScreenBgLg>

      {/* LOADING/PLAY POSITION VISUALIZER */}
      <Loadingsong />

      {/* PLAYLIST */}
      {playerMood && <PlayList />}

      {/* SCREEN MESSAGE BEFORE PLAYSLIST IS CHOSEN */}
      {!playerMood && (
        <p className={`screenMessage ${windowSize}`}>{message}</p>
      )}
    </div>
  )
}
const mapStateToProps = state => {
  return {
    playerMood: state.player.mood,
    windowSize: state.window.size
  }
}
export default connect(mapStateToProps)(PlayerScreen)
