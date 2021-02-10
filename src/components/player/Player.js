import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import {
  setTrackNumber,
  setPlayStatus,
  setLoadingStatus,
  setPlayingStatus
} from '../../actions/player'
import './player.css'

import Sound from 'react-sound'

import { moods } from '../../data/moods'
import PlayerBgLg from './PlayerBgLg'
import PlayerDecorations from './PlayerDecorations'
import PlayerScreen from './PlayerScreen/PlayerScreen'
import Sliders from './Sliders/Sliders'
import SoftButton from './SoftButton/SoftButton'

function Player(props) {
  const [ready, setReady] = useState(false)

  const handleFinishedPlaying = () => {
    props.setTrackNumber(props.trackNumber + 1)
  }

  const handleSoundError = (errorCode, errorDescription) => {
    console.log(errorCode, errorDescription)
  }

  const handleSongLoading = ({ bytesLoaded, bytesTotal, duration }) => {
    props.setLoadingStatus({ bytesLoaded, bytesTotal, duration })
  }

  const handleSongPlaying = ({ position, duration }) => {
    props.setPlayingStatus({ position, duration })
  }

  useEffect(() => setReady(true))

  return (
    <div className={`player ${props.windowSize}`}>
      <PlayerBgLg className="playerBackground" />
      <PlayerDecorations />
      <Sliders />
      <PlayerScreen />

      {/* ----- PLAYLISTS BUTTONS ----- */}
      <div className="softButtons">
        {moods.map((mood, index) => (
          <SoftButton
            key={index}
            index={index}
            testId="moodButton"
            className="softButton"
            text={mood.name}
            mood={mood.name}
          />
        ))}
      </div>

      {/* ----- SOUND PLAYER ----- */}
      {/* Does not add any visible element to the DOM */}
      {ready && (
        <Sound
          url={props.playlist ? props.playlist[props.trackNumber].url : ''}
          volume={20}
          playStatus={props.playStatus}
          onLoading={handleSongLoading}
          onFinishedPlaying={handleFinishedPlaying}
          onError={handleSoundError}
          onPlaying={handleSongPlaying}
        />
      )}
    </div>
  )
}

const mapStateToProps = state => {
  return {
    mood: state.player.mood ? state.player.mood.name : undefined,
    playlist: state.player.mood ? state.player.mood.playlist : undefined,
    playStatus: state.player.playStatus,
    playingStatus: state.player.playingStatus,
    trackNumber: state.player.trackNumber,
    windowWidth: state.window.width,
    windowHeight: state.window.height,
    windowSize: state.window.size
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setTrackNumber: num => dispatch(setTrackNumber(num)),
    setPlayStatus: status => dispatch(setPlayStatus(status)),
    setPlayingStatus: status => dispatch(setPlayingStatus(status)),
    setLoadingStatus: status => dispatch(setLoadingStatus(status))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Player)
