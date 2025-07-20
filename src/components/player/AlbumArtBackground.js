import React, { useState, useEffect, useRef } from 'react'
import { usePlayer } from '../../contexts/PlayerContext'
import { useCRTEffect } from '../../hooks/useInterferenceEffect'
import './AlbumArtBackground.css'

const AlbumArtBackground = ({ className }) => {
  const { playlist, trackNumber } = usePlayer()
  const canvasRef = useRef(null)
  const currentImageRef = useRef(null)
  const [currentImageUrl, setCurrentImageUrl] = useState(null)
  
  // CRT effects hook
  useCRTEffect(canvasRef.current, currentImageRef.current)

  // Canvas setup and resize handling
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  // Image loading and canvas rendering
  useEffect(() => {
    if (playlist && playlist[trackNumber] && playlist[trackNumber].image) {
      const newImageUrl = playlist[trackNumber].image
      
      // Skip if same image
      if (newImageUrl === currentImageUrl) return
      
      // Create new image element for canvas rendering
      const img = new Image()
      img.crossOrigin = 'anonymous' // Enable CORS for canvas manipulation
      
      img.onload = () => {
        currentImageRef.current = img
        setCurrentImageUrl(newImageUrl)
        
        // Initial draw without effects
        const canvas = canvasRef.current
        if (canvas) {
          const ctx = canvas.getContext('2d')
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        }
      }
      
      img.onerror = () => {
        console.warn('Failed to load album art:', newImageUrl)
      }
      
      img.src = newImageUrl
    }
  }, [trackNumber, playlist, currentImageUrl])

  return (
    <div className={`album-art-background ${className || ''}`}>
      <canvas
        ref={canvasRef}
        className="album-art-canvas"
      />
    </div>
  )
}

export default AlbumArtBackground