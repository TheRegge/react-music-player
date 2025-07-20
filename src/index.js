import React from 'react'
import { createRoot } from 'react-dom/client'
import { AppProviders } from './contexts/AppProviders'
import { Howler } from 'howler'
import './index.css'
import App from './App'

// Initialize Howler to use Web Audio API
Howler.usingWebAudio = true
Howler.autoUnlock = true

// Initialize the audio context on first user interaction
// if (Howler.ctx) {
//   console.log('Howler Web Audio Context initialized')
// } else {
//   console.log('Howler Web Audio Context will be initialized on first user interaction')
// }

const container = document.getElementById('root')
const root = createRoot(container)

root.render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>
)
