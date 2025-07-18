import React, { useState, useRef, useEffect } from 'react'
import { useWindow } from '../../../../../contexts/WindowContext'
import './textscroller.css'

const TextScroller = ({ track, text, playing, width }) => {
  const { size: windowSize } = useWindow()
  const [scrollable, setScrollable] = useState(false)
  const songTitleRef = useRef(null)
  
  // Support both old format (text) and new format (track object)
  const displayText = track ? `${track.title} by ${track.artist}` : text
  
  useEffect(() => {
    if (songTitleRef.current) {
      const titleWidth = songTitleRef.current.scrollWidth
      if (titleWidth > width) {
        setScrollable(true)
      }
    }
  }, [width, displayText])

  const textClasses =
    scrollable && playing
      ? `songTitle scrolling ${windowSize}`
      : 'songTitle'
      
  return (
    <div className="textScroller">
      <div className={textClasses} ref={songTitleRef}>
        {displayText}
      </div>
    </div>
  )
}

export default TextScroller
