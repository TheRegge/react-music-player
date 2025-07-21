// Bot detection utility
const BOT_DETECTION_KEY = 'app_load_tracking'
const SUSPICIOUS_LOAD_THRESHOLD = 10 // Number of loads in time window
const TIME_WINDOW = 60 * 1000 // 1 minute
const CHALLENGE_COOLDOWN = 5 * 60 * 1000 // 5 minutes

/**
 * Track page loads and detect suspicious patterns
 */
export class BotDetector {
  constructor() {
    this.loadHistory = this.getLoadHistory()
    this.challengePassed = this.getChallengeStatus()
  }

  /**
   * Get load history from localStorage
   */
  getLoadHistory() {
    try {
      const data = localStorage.getItem(BOT_DETECTION_KEY)
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  }

  /**
   * Save load history to localStorage
   */
  saveLoadHistory(history) {
    try {
      // Keep only recent entries
      const recentHistory = history.filter(
        timestamp => Date.now() - timestamp < TIME_WINDOW * 2
      )
      localStorage.setItem(BOT_DETECTION_KEY, JSON.stringify(recentHistory))
    } catch (error) {
      console.error('Failed to save load history:', error)
    }
  }

  /**
   * Get challenge status
   */
  getChallengeStatus() {
    try {
      const status = localStorage.getItem('bot_challenge_passed')
      if (!status) return null
      
      const { timestamp } = JSON.parse(status)
      // Challenge expires after cooldown period
      if (Date.now() - timestamp > CHALLENGE_COOLDOWN) {
        localStorage.removeItem('bot_challenge_passed')
        return null
      }
      
      return true
    } catch {
      return null
    }
  }

  /**
   * Mark challenge as passed
   */
  markChallengePassed() {
    try {
      localStorage.setItem('bot_challenge_passed', JSON.stringify({
        timestamp: Date.now()
      }))
      this.challengePassed = true
    } catch (error) {
      console.error('Failed to save challenge status:', error)
    }
  }

  /**
   * Record a page load and check for suspicious activity
   */
  recordPageLoad() {
    const now = Date.now()
    this.loadHistory.push(now)
    
    // Filter loads within time window
    const recentLoads = this.loadHistory.filter(
      timestamp => now - timestamp < TIME_WINDOW
    )
    
    // Save updated history
    this.saveLoadHistory(this.loadHistory)
    
    // Check if suspicious
    const isSuspicious = recentLoads.length > SUSPICIOUS_LOAD_THRESHOLD
    
    return {
      isSuspicious: isSuspicious && !this.challengePassed,
      loadCount: recentLoads.length,
      timeWindow: TIME_WINDOW,
      threshold: SUSPICIOUS_LOAD_THRESHOLD
    }
  }

  /**
   * Reset detection (for testing)
   */
  reset() {
    localStorage.removeItem(BOT_DETECTION_KEY)
    localStorage.removeItem('bot_challenge_passed')
    this.loadHistory = []
    this.challengePassed = null
  }
}

/**
 * Simple challenge to verify human interaction
 */
export class SimpleChallenge {
  static generate() {
    const num1 = Math.floor(Math.random() * 10) + 1
    const num2 = Math.floor(Math.random() * 10) + 1
    const answer = num1 + num2
    
    return {
      question: `What is ${num1} + ${num2}?`,
      verify: (userAnswer) => {
        return parseInt(userAnswer) === answer
      }
    }
  }
}

// Create singleton instance
export const botDetector = new BotDetector()