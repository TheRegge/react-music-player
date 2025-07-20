import React, { useState, useEffect, useRef } from 'react'
import { usePlayer } from '../../contexts/PlayerContext'
import './AlbumArtBackground.css'

const AlbumArtBackground = ({ className }) => {
  const { playlist, trackNumber } = usePlayer()
  const [images, setImages] = useState([])
  const containerRef = useRef(null)
  const timeoutIdsRef = useRef([])

  // Cleanup function
  useEffect(() => {
    return () => {
      // Clear all timeouts on unmount
      timeoutIdsRef.current.forEach(id => clearTimeout(id))
      
      // Remove all images from DOM
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
    }
  }, [])

  useEffect(() => {
    if (playlist && playlist[trackNumber] && playlist[trackNumber].image) {
      const newImageUrl = playlist[trackNumber].image
      
      // Check if this image is already displayed
      const existingImage = images.find(img => img.url === newImageUrl && img.active)
      if (existingImage) return

      // Create new image element
      const imgElement = document.createElement('img')
      imgElement.src = newImageUrl
      imgElement.className = 'album-art-image'
      imgElement.alt = 'Album art'
      
      imgElement.onload = () => {
        // Add to DOM
        if (containerRef.current) {
          containerRef.current.appendChild(imgElement)
          
          // Force reflow to ensure the browser registers the element at opacity 0
          imgElement.offsetHeight
          
          // Add active class to trigger fade in
          requestAnimationFrame(() => {
            imgElement.classList.add('active')
            
            // Fade out and remove previous images
            const allImages = containerRef.current.querySelectorAll('img')
            allImages.forEach((img, index) => {
              if (img !== imgElement) {
                img.classList.remove('active')
                // Remove after transition
                const timeoutId = setTimeout(() => {
                  if (img.parentNode === containerRef.current) {
                    containerRef.current.removeChild(img)
                  }
                  // Remove timeout ID from tracking
                  timeoutIdsRef.current = timeoutIdsRef.current.filter(id => id !== timeoutId)
                }, 1000)
                // Track timeout ID for cleanup
                timeoutIdsRef.current.push(timeoutId)
              }
            })
          })
        }
      }
    }
  }, [trackNumber, playlist])

  return (
    <div 
      ref={containerRef}
      className={`album-art-background ${className || ''}`}
    />
  )
}

export default AlbumArtBackground