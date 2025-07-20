import React from 'react'
import { useWindow } from './contexts/WindowContext'
import './App.css'
import Player from './components/player/Player'
import AlbumArtBackground from './components/player/AlbumArtBackground'

const App = () => {
  const { size: windowSize } = useWindow()
  
  return (
    <div className={`app ${windowSize}`}>
      <AlbumArtBackground className="app-background" />
      <section className={`container ${windowSize}`}>
        <Player />
      </section>
    </div>
  )
}

export default App
