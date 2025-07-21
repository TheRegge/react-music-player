import React, { useState, useEffect } from 'react'
import { botDetector, SimpleChallenge } from '../utils/botDetection'
import './BotChallenge.css'

const BotChallenge = ({ onPass }) => {
  const [challenge, setChallenge] = useState(null)
  const [answer, setAnswer] = useState('')
  const [error, setError] = useState(false)
  const [attempts, setAttempts] = useState(0)

  useEffect(() => {
    // Generate challenge on mount
    setChallenge(SimpleChallenge.generate())
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!challenge) return
    
    if (challenge.verify(answer)) {
      // Challenge passed
      botDetector.markChallengePassed()
      if (onPass) onPass()
    } else {
      // Wrong answer
      setError(true)
      setAttempts(prev => prev + 1)
      setAnswer('')
      
      // Generate new challenge after 3 failed attempts
      if (attempts >= 2) {
        setChallenge(SimpleChallenge.generate())
        setAttempts(0)
      }
      
      // Clear error after delay
      setTimeout(() => setError(false), 2000)
    }
  }

  if (!challenge) return null

  return (
    <div className="bot-challenge-overlay">
      <div className="bot-challenge">
        <div className="bot-challenge__content">
          <h2 className="bot-challenge__title">Quick Verification</h2>
          <p className="bot-challenge__description">
            We've detected unusual activity. Please solve this simple math problem to continue.
          </p>
          
          <form onSubmit={handleSubmit} className="bot-challenge__form">
            <label className="bot-challenge__label">
              {challenge.question}
            </label>
            
            <input
              type="number"
              className={`bot-challenge__input ${error ? 'bot-challenge__input--error' : ''}`}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Your answer"
              autoFocus
              required
            />
            
            {error && (
              <p className="bot-challenge__error">
                Incorrect answer. Please try again.
              </p>
            )}
            
            <button type="submit" className="bot-challenge__button">
              Verify
            </button>
          </form>
          
          <p className="bot-challenge__note">
            This helps us prevent automated abuse and keep the service running smoothly.
          </p>
        </div>
      </div>
    </div>
  )
}

export default BotChallenge