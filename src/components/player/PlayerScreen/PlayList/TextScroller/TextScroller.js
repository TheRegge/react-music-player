import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useWindow } from '../../../../../contexts/WindowContext'
import './textscroller.css'

const TextScroller = ({ track, text, playing, width }) => {
  const { size: windowSize } = useWindow()
  const [scrollable, setScrollable] = useState(false)
  const [animationDuration, setAnimationDuration] = useState(15)
  const [textWidth, setTextWidth] = useState(0)
  const songTitleRef = useRef(null)
  const measureRef = useRef(null)
  
  // Support both old format (text) and new format (track object)
  const displayText = track ? `${track.title} by ${track.artist}` : text
  
  useEffect(() => {
    if (measureRef.current) {
      // Measure the actual width of one text segment including padding
      const singleTextWidth = measureRef.current.offsetWidth
      setTextWidth(singleTextWidth)
      
      if (singleTextWidth > width) {
        setScrollable(true)
        // Calculate duration for consistent speed (pixels per second)
        const pixelsPerSecond = 50 // Adjust this to change speed
        const duration = singleTextWidth / pixelsPerSecond
        setAnimationDuration(Math.max(5, duration))
      } else {
        setScrollable(false)
      }
    }
  }, [width, displayText])

  const marqueeVariants = {
    animate: {
      x: [0, -textWidth],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: animationDuration,
          ease: "linear"
        }
      }
    }
  }
      
  return (
    <div className="textScroller">
      {/* Hidden element to measure text width */}
      <div 
        ref={measureRef}
        className="marquee-text"
        style={{ 
          position: 'absolute', 
          visibility: 'hidden', 
          whiteSpace: 'nowrap',
          pointerEvents: 'none'
        }}
      >
        {displayText}
      </div>
      
      {scrollable && playing ? (
        <motion.div 
          className={`songTitle marquee-container ${windowSize}`}
          ref={songTitleRef}
          variants={marqueeVariants}
          animate="animate"
        >
          <span className="marquee-text">{displayText}</span>
          <span className="marquee-text">{displayText}</span>
        </motion.div>
      ) : (
        <div className={`songTitle ${windowSize}`} ref={songTitleRef}>
          {displayText}
        </div>
      )}
    </div>
  )
}

export default TextScroller
