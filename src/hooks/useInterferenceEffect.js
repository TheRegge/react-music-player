import { useEffect, useRef, useCallback } from 'react'

export const useCRTEffect = (canvas, image) => {
  const animationIdRef = useRef(null)
  const timeRef = useRef(0)

  const drawCRTEffects = useCallback(() => {
    if (!canvas || !image) {
      console.log('CRT Effect: Canvas or image not ready', { canvas: !!canvas, image: !!image })
      return
    }

    const ctx = canvas.getContext('2d')
    const { width, height } = canvas
    
    // Update animation time
    timeRef.current += 0.016 // ~60fps

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // First draw the base image normally
    ctx.drawImage(image, 0, 0, width, height)

    // === CHROMATIC ABERRATION ===
    // Draw RGB channels with slight offsets
    const aberrationAmount = 3 // Slightly larger offset
    
    ctx.save()
    ctx.globalCompositeOperation = 'multiply'
    
    // Red channel (shifted left)
    ctx.globalAlpha = 0.9
    ctx.drawImage(image, -aberrationAmount, 0, width, height)
    
    // Blue channel (shifted right)
    ctx.globalAlpha = 0.9  
    ctx.drawImage(image, aberrationAmount, 0, width, height)
    
    ctx.restore()

    // === HORIZONTAL SCANLINES ===
    // Static thin horizontal lines across the screen
    ctx.save()
    ctx.globalCompositeOperation = 'multiply'
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)' // Much more visible
    
    for (let y = 0; y < height; y += 2) {
      ctx.fillRect(0, y, width, 1)
    }
    ctx.restore()

    // === VERTICAL RGB PHOSPHOR STRIPS ===
    // Colored vertical lines mimicking CRT phosphors
    ctx.save()
    ctx.globalCompositeOperation = 'overlay'
    ctx.globalAlpha = 0.15 // Much more visible
    
    const stripWidth = 1
    const stripSpacing = 3
    
    for (let x = 0; x < width; x += stripSpacing) {
      // Cycle through RGB pattern
      const colorIndex = Math.floor(x / stripSpacing) % 3
      if (colorIndex === 0) {
        ctx.fillStyle = '#ff0000' // Red
      } else if (colorIndex === 1) {
        ctx.fillStyle = '#00ff00' // Green  
      } else {
        ctx.fillStyle = '#0000ff' // Blue
      }
      
      ctx.fillRect(x, 0, stripWidth, height)
    }
    ctx.restore()

    // === ANIMATED VIGNETTE ===
    // Smooth pulsing vignette effect with lower max intensity
    const vignetteIntensity = 0.4 + Math.sin(timeRef.current * 4) * 0.2 // Smooth pulse (0.2 to 0.6)
    
    ctx.save()
    
    // Create radial gradient for vignette
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.max(width, height) * 0.5 // Even smaller radius for stronger effect
    
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius)
    gradient.addColorStop(0, `rgba(0, 0, 0, 0)`)
    gradient.addColorStop(0.4, `rgba(0, 0, 0, 0)`)
    gradient.addColorStop(1, `rgba(0, 0, 0, ${vignetteIntensity})`)
    
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)
    
    ctx.restore()

    // === SUBTLE SCREEN CURVE DARKENING ===
    // Darken the edges to simulate CRT curvature
    ctx.save()
    ctx.globalCompositeOperation = 'multiply'
    
    // Top and bottom edge darkening
    const edgeGradientTop = ctx.createLinearGradient(0, 0, 0, height * 0.1)
    edgeGradientTop.addColorStop(0, 'rgba(0, 0, 0, 0.8)')
    edgeGradientTop.addColorStop(1, 'rgba(0, 0, 0, 1)')
    
    ctx.fillStyle = edgeGradientTop
    ctx.fillRect(0, 0, width, height * 0.02)
    
    const edgeGradientBottom = ctx.createLinearGradient(0, height, 0, height * 0.9)
    edgeGradientBottom.addColorStop(0, 'rgba(0, 0, 0, 0.8)')
    edgeGradientBottom.addColorStop(1, 'rgba(0, 0, 0, 1)')
    
    ctx.fillStyle = edgeGradientBottom
    ctx.fillRect(0, height * 0.98, width, height * 0.02)
    
    ctx.restore()

  }, [canvas, image])

  const animate = useCallback(() => {
    drawCRTEffects()
    animationIdRef.current = requestAnimationFrame(animate)
  }, [drawCRTEffects])

  useEffect(() => {
    console.log('CRT Effect: Starting animation loop')
    animate()

    return () => {
      console.log('CRT Effect: Stopping animation loop')
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
    }
  }, [animate])

  return { drawCRTEffects }
}