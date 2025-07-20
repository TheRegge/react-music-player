import React, { useEffect } from 'react'
import { usePlayer } from '../../../../contexts/PlayerContext'
import { useWindow } from '../../../../contexts/WindowContext'
import './playList.css'
import Scroller from './Scroller'

const PlayList = props => {
  const { moodObject, trackNumber } = usePlayer()
  const { size: windowSize } = useWindow()
  
  const getScrollerHeight = height => {
    props.getHeight(height)
  }

  const scrollToTop = el => {
    if (typeof el.scrollTo === 'function') {
      el.scrollTo(0, 0)
    }
  }

  const scrollToCurrentTrack = () => {
    const playlistEl = document.getElementById('playlist')
    if (!playlistEl) return

    const trackItems = playlistEl.querySelectorAll('.listItem')
    const currentTrackEl = trackItems[trackNumber]
    
    if (currentTrackEl) {
      const playlistRect = playlistEl.getBoundingClientRect()
      const trackRect = currentTrackEl.getBoundingClientRect()
      const playlistScrollTop = playlistEl.scrollTop
      
      const trackTop = trackRect.top - playlistRect.top + playlistScrollTop
      const trackBottom = trackTop + trackRect.height
      const playlistVisibleTop = playlistScrollTop
      const playlistVisibleBottom = playlistScrollTop + playlistEl.offsetHeight
      
      // Check if track is not fully visible
      if (trackTop < playlistVisibleTop || trackBottom > playlistVisibleBottom) {
        // Calculate the center position
        const scrollToPosition = trackTop - (playlistEl.offsetHeight / 2) + (trackRect.height / 2)
        
        playlistEl.scrollTo({
          top: Math.max(0, scrollToPosition),
          behavior: 'smooth'
        })
      }
    }
  }

  useEffect(() => {
    //   scroll to the first track on mood change
    scrollToTop(document.getElementById('playlist'))
  }, [moodObject])

  useEffect(() => {
    // Scroll to current track when track number changes
    if (trackNumber >= 0) {
      // Small delay to ensure DOM has updated
      setTimeout(scrollToCurrentTrack, 100)
    }
  }, [trackNumber])

  return (
    <div id="playlist" className={`playList ${windowSize}`}>
      <Scroller scroll={props.scroll} getHeight={getScrollerHeight} />
    </div>
  )
}

export default PlayList
