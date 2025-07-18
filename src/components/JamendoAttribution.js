import React from 'react'
import './JamendoAttribution.css'

const JamendoAttribution = ({ className = '' }) => {
  const handleClick = () => {
    window.open('https://www.jamendo.com', '_blank', 'noopener,noreferrer')
  }

  return (
    <div className={`jamendo-attribution ${className}`}>
      <span className="jamendo-text">
        Music powered by{' '}
        <span 
          className="jamendo-link"
          onClick={handleClick}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleClick()
            }
          }}
        >
          Jamendo
        </span>
      </span>
    </div>
  )
}

export default JamendoAttribution