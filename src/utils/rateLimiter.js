// Rate limiter utility for API calls
const STORAGE_KEY = 'jamendo_api_rate_limit'
const RATE_LIMIT_WINDOW = 60 * 60 * 1000 // 1 hour in milliseconds
const MAX_CALLS_PER_WINDOW = 30 // Maximum API calls per hour

/**
 * Get current rate limit data from localStorage
 * @returns {Object} Rate limit data
 */
const getRateLimitData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return { calls: [], windowStart: Date.now() }
    
    const parsed = JSON.parse(data)
    const now = Date.now()
    
    // Reset if window has expired
    if (now - parsed.windowStart > RATE_LIMIT_WINDOW) {
      return { calls: [], windowStart: now }
    }
    
    // Filter out expired calls
    const validCalls = parsed.calls.filter(
      timestamp => now - timestamp < RATE_LIMIT_WINDOW
    )
    
    return { calls: validCalls, windowStart: parsed.windowStart }
  } catch (error) {
    console.error('Error reading rate limit data:', error)
    return { calls: [], windowStart: Date.now() }
  }
}

/**
 * Save rate limit data to localStorage
 * @param {Object} data - Rate limit data to save
 */
const saveRateLimitData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Error saving rate limit data:', error)
  }
}

/**
 * Check if we can make an API call based on rate limits
 * @returns {Object} { allowed: boolean, remaining: number, resetIn: number }
 */
export const checkRateLimit = () => {
  const data = getRateLimitData()
  const remaining = MAX_CALLS_PER_WINDOW - data.calls.length
  const resetIn = Math.max(0, RATE_LIMIT_WINDOW - (Date.now() - data.windowStart))
  
  return {
    allowed: remaining > 0,
    remaining,
    resetIn,
    resetTime: new Date(data.windowStart + RATE_LIMIT_WINDOW).toISOString()
  }
}

/**
 * Record an API call for rate limiting
 * @returns {boolean} Whether the call was allowed
 */
export const recordApiCall = () => {
  const data = getRateLimitData()
  
  if (data.calls.length >= MAX_CALLS_PER_WINDOW) {
    return false
  }
  
  data.calls.push(Date.now())
  saveRateLimitData(data)
  return true
}

/**
 * Reset rate limit (useful for testing)
 */
export const resetRateLimit = () => {
  localStorage.removeItem(STORAGE_KEY)
}

/**
 * Get human-readable time remaining
 * @param {number} milliseconds - Time in milliseconds
 * @returns {string} Human-readable time
 */
export const formatTimeRemaining = (milliseconds) => {
  const seconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  
  if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ${minutes % 60} minute${minutes % 60 !== 1 ? 's' : ''}`
  }
  if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ${seconds % 60} second${seconds % 60 !== 1 ? 's' : ''}`
  }
  return `${seconds} second${seconds !== 1 ? 's' : ''}`
}

// Export configuration for transparency
export const RATE_LIMIT_CONFIG = {
  MAX_CALLS_PER_WINDOW,
  RATE_LIMIT_WINDOW,
  STORAGE_KEY
}