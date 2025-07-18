import React from 'react'
import { createRoot } from 'react-dom/client'
import { AppProviders } from './contexts/AppProviders'
import './index.css'
import App from './App'

const container = document.getElementById('root')
const root = createRoot(container)

root.render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>
)
