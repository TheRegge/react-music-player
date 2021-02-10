import React from 'react'
import './App.css'
import Player from './components/player/Player'
import WindowDimensions from './components/WindowDimensions'

const App = props => {
  return (
    <>
      <WindowDimensions />
      <div className={`app ${props.windowSize}`}>
        <section className={`container ${props.windowSize}`}>
          <Player />
        </section>
      </div>
    </>
  )
}

export default App
