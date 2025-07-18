import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

const WindowContext = createContext()

const getWindowSize = () => {
  const width = window.innerWidth
  const height = window.innerHeight
  
  let size = 'xs'
  if (width >= 1200) {
    size = 'lg'
  } else if (width >= 992) {
    size = 'md'
  } else if (width >= 768) {
    size = 'sm'
  }
  
  return { width, height, size }
}

export const WindowProvider = ({ children }) => {
  const [windowDimensions, setWindowDimensions] = useState(getWindowSize())

  const handleResize = useCallback(() => {
    setWindowDimensions(getWindowSize())
  }, [])

  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [handleResize])

  return (
    <WindowContext.Provider value={windowDimensions}>
      {children}
    </WindowContext.Provider>
  )
}

export const useWindow = () => {
  const context = useContext(WindowContext)
  if (!context) {
    throw new Error('useWindow must be used within a WindowProvider')
  }
  return context
}