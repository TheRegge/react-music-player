import React, { useState, useEffect, useRef } from 'react'
import { usePlayer } from '../../contexts/PlayerContext'
import { useCRTEffect } from '../../hooks/useInterferenceEffect'
import './AlbumArtBackground.css'

const AlbumArtBackground = ({ className }) => {
  const { playlist, trackNumber, mood, playlistCache, preloadingComplete } = usePlayer()
  const canvasRef = useRef(null)
  const currentImageRef = useRef(null)
  const mosaicImagesRef = useRef([])
  const [currentImageUrl, setCurrentImageUrl] = useState(null)
  const [mosaicImages, setMosaicImages] = useState([])
  const [mosaicLoaded, setMosaicLoaded] = useState(false)
  
  // Determine if we should use mosaic mode (no mood selected but have cached playlists)
  const shouldUseMosaic = !mood && preloadingComplete && Object.keys(playlistCache).length > 0
  
  // Debug logging
  useEffect(() => {
    console.log('AlbumArtBackground state:', {
      mood,
      preloadingComplete,
      cacheKeys: Object.keys(playlistCache),
      shouldUseMosaic,
      mosaicLoaded,
      mosaicImageCount: mosaicImagesRef.current.length
    })
  }, [mood, preloadingComplete, playlistCache, shouldUseMosaic, mosaicLoaded])
  
  // CRT effects hook - pass mosaic images if in mosaic mode
  useCRTEffect(canvasRef.current, shouldUseMosaic ? mosaicImagesRef.current : currentImageRef.current)

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

  // Mosaic image loading for when no mood is selected
  useEffect(() => {
    if (!shouldUseMosaic || mosaicLoaded) return

    const loadMosaicImages = async () => {
      // Extract all image URLs from cached playlists
      const allImageUrls = Object.values(playlistCache)
        .flat()
        .map(track => track.image)
        .filter(Boolean) // Remove null/undefined images
        .slice(0, 30) // Limit to 30 images max

      if (allImageUrls.length === 0) return

      // Load all images
      const imageLoadPromises = allImageUrls.map((url, index) => {
        return new Promise((resolve) => {
          const img = new Image()
          img.crossOrigin = 'anonymous'
          img.onload = () => resolve({ img, index, url })
          img.onerror = () => {
            console.warn('Failed to load mosaic image:', url)
            resolve(null)
          }
          img.src = url
        })
      })

      try {
        const results = await Promise.all(imageLoadPromises)
        const loadedImages = results.filter(result => result !== null)
        
        if (loadedImages.length > 0) {
          mosaicImagesRef.current = loadedImages.map(result => result.img)
          setMosaicImages(loadedImages)
          setMosaicLoaded(true)
        }
      } catch (error) {
        console.error('Error loading mosaic images:', error)
      }
    }

    loadMosaicImages()
  }, [shouldUseMosaic, playlistCache, mosaicLoaded])

  // Reset mosaic when mood is selected
  useEffect(() => {
    if (mood && mosaicLoaded) {
      setMosaicLoaded(false)
      setMosaicImages([])
      mosaicImagesRef.current = []
    }
  }, [mood, mosaicLoaded])

  // Image loading and canvas rendering
  useEffect(() => {
    // Skip normal image loading if we're in mosaic mode
    if (shouldUseMosaic) return
    
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
  }, [trackNumber, playlist, currentImageUrl, shouldUseMosaic])

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