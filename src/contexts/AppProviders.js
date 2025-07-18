import React from 'react'
import { PlayerProvider } from './PlayerContext'
import { WindowProvider } from './WindowContext'

export const AppProviders = ({ children }) => {
  return (
    <WindowProvider>
      <PlayerProvider>
        {children}
      </PlayerProvider>
    </WindowProvider>
  )
}