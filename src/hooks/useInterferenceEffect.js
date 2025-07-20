import { useEffect, useCallback } from 'react'
import { useWindow } from '../contexts/WindowContext'

export const useCRTEffect = (canvas, image) => {
  const { size: windowSize } = useWindow()

  const drawCRTEffects = useCallback(() => {
    if (!canvas || !image) {
      return
    }

    const ctx = canvas.getContext('2d')
    const { width, height } = canvas

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Calculate tile dimensions based on screen size
    // Small/medium screens (phones/tablets): 2x2 grid (4 tiles)
    // Large screens (desktop): 3x2 grid (6 tiles)
    const isSmallOrMedium = windowSize === 'xs' || windowSize === 'sm'
    const cols = isSmallOrMedium ? 2 : 3
    const rows = 2
    const tileWidth = width / cols
    const tileHeight = height / rows

    // Color variations for each tile with static vignette intensities
    const tileVariations6 = [
      { brightness: 1.2, hue: 0, saturation: 1.0, vignetteIntensity: 0.3 },   // Brighter
      { brightness: 0.7, hue: 0, saturation: 1.0, vignetteIntensity: 0.5 },   // Darker
      { brightness: 1.0, hue: 20, saturation: 1.3, vignetteIntensity: 0.4 },  // Red tint
      { brightness: 1.0, hue: 60, saturation: 1.2, vignetteIntensity: 0.6 },  // Yellow tint
      { brightness: 1.0, hue: 120, saturation: 1.2, vignetteIntensity: 0.2 }, // Green tint
      { brightness: 0.9, hue: 180, saturation: 1.1, vignetteIntensity: 0.45 } // Cyan tint
    ]
    
    const tileVariations4 = [
      { brightness: 1.2, hue: 0, saturation: 1.0, vignetteIntensity: 0.3 },   // Brighter
      { brightness: 0.7, hue: 0, saturation: 1.0, vignetteIntensity: 0.5 },   // Darker
      { brightness: 1.0, hue: 20, saturation: 1.3, vignetteIntensity: 0.4 },  // Red tint
      { brightness: 1.0, hue: 120, saturation: 1.2, vignetteIntensity: 0.2 }  // Green tint
    ]
    
    const tileVariations = isSmallOrMedium ? tileVariations4 : tileVariations6

    // Draw each tile with its variations
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const tileIndex = row * cols + col
        const variation = tileVariations[tileIndex]
        
        const x = col * tileWidth
        const y = row * tileHeight

        // Save context for this tile
        ctx.save()
        
        // Clip to tile area
        ctx.beginPath()
        ctx.rect(x, y, tileWidth, tileHeight)
        ctx.clip()

        // Apply color filter for this tile
        ctx.filter = `brightness(${variation.brightness}) hue-rotate(${variation.hue}deg) saturate(${variation.saturation})`
        
        // Draw the base image for this tile
        ctx.drawImage(image, x, y, tileWidth, tileHeight)
        
        // Reset filter for effects
        ctx.filter = 'none'

        // Apply CRT effects to this tile
        drawTileCRTEffects(ctx, x, y, tileWidth, tileHeight, variation, tileIndex)
        
        // Restore context
        ctx.restore()
      }
    }
  }, [canvas, image, windowSize])

  const drawTileCRTEffects = (ctx, x, y, width, height, variation, tileIndex) => {
    // === HORIZONTAL SCANLINES ===
    // Static thin horizontal lines across the tile
    ctx.save()
    ctx.globalCompositeOperation = 'multiply'
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
    
    for (let lineY = y; lineY < y + height; lineY += 2) {
      ctx.fillRect(x, lineY, width, 1)
    }
    ctx.restore()

    // === VERTICAL RGB PHOSPHOR STRIPS ===
    // Colored vertical lines mimicking CRT phosphors
    ctx.save()
    ctx.globalCompositeOperation = 'overlay'
    ctx.globalAlpha = 0.15
    
    const stripWidth = 1
    const stripSpacing = 3
    
    for (let lineX = x; lineX < x + width; lineX += stripSpacing) {
      // Cycle through RGB pattern
      const colorIndex = Math.floor((lineX - x) / stripSpacing) % 3
      if (colorIndex === 0) {
        ctx.fillStyle = '#ff0000' // Red
      } else if (colorIndex === 1) {
        ctx.fillStyle = '#00ff00' // Green  
      } else {
        ctx.fillStyle = '#0000ff' // Blue
      }
      
      ctx.fillRect(lineX, y, stripWidth, height)
    }
    ctx.restore()

    // === STATIC VIGNETTE ===
    // Each tile has a fixed vignette intensity
    const vignetteIntensity = variation.vignetteIntensity
    
    ctx.save()
    
    // Create radial gradient for vignette centered on tile
    const centerX = x + width / 2
    const centerY = y + height / 2
    const radius = Math.max(width, height) * 0.5
    
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius)
    gradient.addColorStop(0, `rgba(0, 0, 0, 0)`)
    gradient.addColorStop(0.4, `rgba(0, 0, 0, 0)`)
    gradient.addColorStop(1, `rgba(0, 0, 0, ${vignetteIntensity})`)
    
    ctx.fillStyle = gradient
    ctx.fillRect(x, y, width, height)
    
    ctx.restore()

    // === SUBTLE SCREEN CURVE DARKENING ===
    // Darken the edges to simulate CRT curvature
    ctx.save()
    ctx.globalCompositeOperation = 'multiply'
    
    // Top and bottom edge darkening for this tile
    const edgeGradientTop = ctx.createLinearGradient(0, y, 0, y + height * 0.1)
    edgeGradientTop.addColorStop(0, 'rgba(0, 0, 0, 0.8)')
    edgeGradientTop.addColorStop(1, 'rgba(0, 0, 0, 1)')
    
    ctx.fillStyle = edgeGradientTop
    ctx.fillRect(x, y, width, height * 0.02)
    
    const edgeGradientBottom = ctx.createLinearGradient(0, y + height, 0, y + height * 0.9)
    edgeGradientBottom.addColorStop(0, 'rgba(0, 0, 0, 0.8)')
    edgeGradientBottom.addColorStop(1, 'rgba(0, 0, 0, 1)')
    
    ctx.fillStyle = edgeGradientBottom
    ctx.fillRect(x, y + height * 0.98, width, height * 0.02)
    
    ctx.restore()
  }

  useEffect(() => {
    if (canvas && image) {
      drawCRTEffects()
    }
  }, [canvas, image, drawCRTEffects])

  return { drawCRTEffects }
}