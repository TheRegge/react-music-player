import React from 'react'
import './RotationPrompt.css'

const RotationPrompt = () => {
  return (
    <div className="rotation-prompt">
      <div className="rotation-prompt-content">
        <div className="rotation-icon">
          <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Phone outline */}
            <rect x="30" y="15" width="40" height="70" rx="6" ry="6" stroke="currentColor" strokeWidth="3" fill="none"/>
            {/* Screen */}
            <rect x="34" y="22" width="32" height="48" rx="2" ry="2" fill="currentColor" opacity="0.3"/>
            {/* Home button */}
            <circle cx="50" cy="78" r="3" fill="currentColor"/>
            
            {/* Rotation arrows */}
            <g className="rotation-arrows">
              {/* Top arrow */}
              <path d="M15 25 L25 20 L25 30 Z" fill="currentColor"/>
              <path d="M15 25 Q10 25 10 30 Q10 35 15 35" stroke="currentColor" strokeWidth="2" fill="none"/>
              
              {/* Bottom arrow */}
              <path d="M85 75 L75 80 L75 70 Z" fill="currentColor"/>
              <path d="M85 75 Q90 75 90 70 Q90 65 85 65" stroke="currentColor" strokeWidth="2" fill="none"/>
            </g>
          </svg>
        </div>
        <h2 className="rotation-title">PLEASE ROTATE YOUR DEVICE</h2>
        <p className="rotation-message">
          FOR THE BEST EXPERIENCE, PLEASE ROTATE YOUR DEVICE TO LANDSCAPE MODE.
        </p>
      </div>
    </div>
  )
}

export default RotationPrompt