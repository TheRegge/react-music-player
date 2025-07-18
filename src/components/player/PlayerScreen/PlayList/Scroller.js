import React, { useState } from 'react'
import { usePlayer } from '../../../../contexts/PlayerContext'
import { useWindow } from '../../../../contexts/WindowContext'

import PlayBtn from './Playbtn/Playbtn'
import TextScroller from './TextScroller/TextScroller'
import CCLicenseIcon from '../../../CCLicenseIcon'
import LicenseModal from '../../../LicenseModal'

function Scroller(props) {
  const { 
    playlist, 
    playStatus, 
    trackNumber, 
    setTrackNumber, 
    setPlayStatus 
  } = usePlayer()
  const { size: windowSize } = useWindow()
  const [selectedTrack, setSelectedTrack] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleClick = index => {
    // 1 - this track was not selected before
    if (trackNumber !== index) {
      // set the current track to this index and mark for playing
      setTrackNumber(index)
      setPlayStatus('PLAYING')
    }

    // 2 - this track was selected and playing
    if (trackNumber === index && playStatus === 'PLAYING') {
      // pause the track
      setPlayStatus('PAUSED')
    }

    // 3 - this track was selected and paused
    if (trackNumber === index && playStatus === 'PAUSED') {
      // resume playing track
      setPlayStatus('PLAYING')
    }
  }

  const handleLicenseClick = (track, e) => {
    e.stopPropagation() // Prevent triggering the track click
    setSelectedTrack(track)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedTrack(null)
  }

  return (
    <>
      <LicenseModal 
        track={selectedTrack}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
    <div
      id="playerScroller"
      className={`scroller ${windowSize}`}
      style={{ top: props.scroll }}
    >
      {playlist && playlist.map((song, index) => {
        const playing = trackNumber === index
        const listItemClasses = playing ? 'listItem playing' : 'listItem'
        return (
          <div
            key={`${song.id || song.title}-${index}`}
            onClick={() => {
              handleClick(index)
            }}
            className={listItemClasses}
            aria-label={`Song track: ${song.title} by ${song.artist || 'Unknown Artist'}`}
          >
            {index + 1}.{' '}
            <TextScroller 
              track={song} 
              playing={playing} 
              width={song.artist ? 245 : 285} // Less width when showing CC icon
            />
            {song.artist && (
              <CCLicenseIcon 
                size={18}
                color="#00120B"
                className="track-cc-icon"
                onClick={(e) => handleLicenseClick(song, e)}
                title={`${song.license_name || 'CC License'} - Click for details`}
              />
            )}
            <PlayBtn index={index} />
          </div>
        )
      })}
    </div>
    </>
  )
}

export default Scroller
