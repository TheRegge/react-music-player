import React, { useState, useEffect, useCallback } from 'react'
import { usePlayer } from '../../contexts/PlayerContext'
import { useWindow } from '../../contexts/WindowContext'
import './player.css'

import Sound from '../Sound'
import JamendoAttribution from '../JamendoAttribution'

import { moods } from '../../data/moods'
import PlayerBgLg from './PlayerBgLg'
import PlayerDecorations from './PlayerDecorations'
import PlayerScreen from './PlayerScreen/PlayerScreen'
import Sliders from './Sliders/Sliders'
import SoftButton from './SoftButton/SoftButton'

function Player() {
  const [ready, setReady] = useState(false)
  const { 
    mood,
    playlist,
    playStatus,
    trackNumber,
    setTrackNumber,
    setPlayStatus,
    setLoadingStatus,
    setPlayingStatus
  } = usePlayer()
  const { size: windowSize } = useWindow()

  const handleFinishedPlaying = useCallback(() => {
    setTrackNumber(trackNumber + 1)
  }, [trackNumber, setTrackNumber])

  const handleSoundError = useCallback((errorCode, errorDescription) => {
    console.error('Sound Error:', errorCode, errorDescription)
  }, [])

  const handleSongLoading = useCallback(({ bytesLoaded, bytesTotal, duration }) => {
    setLoadingStatus({ bytesLoaded, bytesTotal, duration })
  }, [setLoadingStatus])

  const handleSongPlaying = useCallback(({ position, duration }) => {
    setPlayingStatus({ position, duration })
  }, [setPlayingStatus])

  useEffect(() => setReady(true), [])

  return (
    <div className={`player ${windowSize}`}>
      <PlayerBgLg className="playerBackground" />
      <PlayerDecorations />
      <JamendoAttribution />
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
            moodId={mood.id}
          />
        ))}
      </div>

      {/* ----- SOUND PLAYER ----- */}
      {/* Does not add any visible element to the DOM */}
      {ready && (
        <Sound
          url={playlist ? playlist[trackNumber].url : ''}
          volume={50}
          playStatus={playStatus}
          onLoading={handleSongLoading}
          onFinishedPlaying={handleFinishedPlaying}
          onError={handleSoundError}
          onPlaying={handleSongPlaying}
        />
      )}
    </div>
  )
}

export default Player
