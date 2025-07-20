import React from 'react'
import { useWindow } from './contexts/WindowContext'
import './App.css'
import Player from './components/player/Player'
import AlbumArtBackground from './components/player/AlbumArtBackground'
import RotationPrompt from './components/RotationPrompt/RotationPrompt'

const App = () => {
  const { size: windowSize } = useWindow()
  
  return (
    <div className={`app ${windowSize}`}>
      <AlbumArtBackground className="app-background" />
      <section className={`container ${windowSize}`}>
        <Player />
      </section>
      <RotationPrompt />
    </div>
  )
}

export default App
