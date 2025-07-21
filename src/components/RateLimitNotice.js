import React from 'react'
import { usePlayer } from '../contexts/PlayerContext'
import { formatTimeRemaining } from '../utils/rateLimiter'
import './RateLimitNotice.css'

const RateLimitNotice = () => {
  const { state } = usePlayer()
  
  // Handle case where state might be undefined during initial render
  if (!state || !state.playlistError || state.playlistError.type !== 'rate_limit') {
    return null
  }
  
  const { playlistError } = state
  
  return (
    <div className="rate-limit-notice">
      <div className="rate-limit-notice__content">
        <div className="rate-limit-notice__icon">⚠️</div>
        <div className="rate-limit-notice__text">
          <h3>API Rate Limit Reached</h3>
          <p>{playlistError.message}</p>
          {playlistError.resetIn && (
            <p className="rate-limit-notice__timer">
              Resets in: {formatTimeRemaining(playlistError.resetIn)}
            </p>
          )}
          <p className="rate-limit-notice__tip">
            Tip: Enable mock data mode in development to avoid rate limits.
          </p>
        </div>
      </div>
    </div>
  )
}

export default RateLimitNotice