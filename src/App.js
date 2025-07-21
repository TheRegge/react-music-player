import React, { useState, useEffect } from 'react'
import { useWindow } from './contexts/WindowContext'
import './App.css'
import Player from './components/player/Player'
import AlbumArtBackground from './components/player/AlbumArtBackground'
import RotationPrompt from './components/RotationPrompt/RotationPrompt'
import ErrorBoundary from './components/ErrorBoundary'
import RateLimitNotice from './components/RateLimitNotice'
import BotChallenge from './components/BotChallenge'
import { botDetector } from './utils/botDetection'

const App = () => {
  const { size: windowSize } = useWindow()
  const [showBotChallenge, setShowBotChallenge] = useState(false)
  
  useEffect(() => {
    // Check for bot-like behavior on component mount
    const detection = botDetector.recordPageLoad()
    
    if (detection.isSuspicious) {
      setShowBotChallenge(true)
      console.log(`Bot detection triggered: ${detection.loadCount} loads in ${detection.timeWindow / 1000}s`)
    }
  }, [])
  
  const handleChallengePass = () => {
    setShowBotChallenge(false)
  }
  
  return (
    <ErrorBoundary>
      {showBotChallenge && <BotChallenge onPass={handleChallengePass} />}
      <div className={`app ${windowSize}`}>
        <AlbumArtBackground className="app-background" />
        <RateLimitNotice />
        <div className="header-links">
          <a href="https://github.com/TheRegge/react-music-player" target="_blank" rel="noopener noreferrer" className="header-link">
            GitHub
          </a>
          <a href="https://zaleman.co" target="_blank" rel="noopener noreferrer" className="header-link">
            Portfolio
          </a>
        </div>
        <section className={`container ${windowSize}`}>
          <Player />
        </section>
        <RotationPrompt />
      </div>
    </ErrorBoundary>
  )
}

export default App
