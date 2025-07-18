import React from 'react'
import { useWindow } from './contexts/WindowContext'
import './App.css'
import Player from './components/player/Player'

const App = () => {
  const { size: windowSize } = useWindow()
  
  return (
    <div className={`app ${windowSize}`}>
      <section className={`container ${windowSize}`}>
        <Player />
      </section>
    </div>
  )
}

export default App
