import React from 'react'
import { createPortal } from 'react-dom'
import './LicenseModal.css'

const LicenseModal = ({ track, isOpen, onClose }) => {
  if (!isOpen || !track) return null

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const openExternalLink = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return createPortal(
    <div className="license-modal-backdrop" onClick={handleBackdropClick}>
      <div className="license-modal">
        <button className="license-modal-close" onClick={onClose}>
          ×
        </button>
        
        <div className="license-modal-content">
          <h3 className="license-modal-title">Track Information</h3>
          
          <div className="jamendo-intro">
            <p>Music provided by <strong>Jamendo</strong></p>
            <p>Jamendo is a platform for free, legal and unlimited music published under Creative Commons licenses.</p>
          </div>
          
          <div className="track-info">
            <h4>"{track.title}"</h4>
            <p><strong>Artist:</strong> {track.artist}</p>
            {track.album && <p><strong>Album:</strong> {track.album}</p>}
            <p><strong>License:</strong> {track.license_name}</p>
          </div>

          <div className="attribution-info">
            <h4>Required Attribution</h4>
            <p>
              This work is licensed under a Creative Commons license. 
              You are free to use this music with proper attribution.
            </p>
            
            <div className="attribution-example">
              <strong>Attribution example:</strong><br/>
              "{track.title}" by {track.artist} is licensed under {track.license_name}
            </div>
          </div>

          <div className="license-links">
            <button 
              className="license-link-btn"
              onClick={() => openExternalLink(track.license_ccurl)}
            >
              View License Details
            </button>
            
            <button 
              className="license-link-btn"
              onClick={() => openExternalLink(track.artist_url)}
            >
              View Artist Profile
            </button>
            
            <button 
              className="license-link-btn"
              onClick={() => openExternalLink(track.track_url)}
            >
              View on Jamendo
            </button>
          </div>

        </div>
      </div>
    </div>,
    document.body
  )
}

export default LicenseModal