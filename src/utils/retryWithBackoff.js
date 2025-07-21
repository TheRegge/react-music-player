/**
 * Retry a function with exponential backoff
 * @param {Function} fn - The async function to retry
 * @param {Object} options - Retry options
 * @param {number} options.maxRetries - Maximum number of retries (default: 3)
 * @param {number} options.initialDelay - Initial delay in ms (default: 1000)
 * @param {number} options.maxDelay - Maximum delay in ms (default: 10000)
 * @param {number} options.factor - Exponential factor (default: 2)
 * @param {Function} options.shouldRetry - Function to determine if error is retryable
 * @param {Function} options.onRetry - Callback called before each retry
 * @returns {Promise} Result of the function
 */
export async function retryWithBackoff(fn, options = {}) {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    factor = 2,
    shouldRetry = () => true,
    onRetry = () => {}
  } = options

  let lastError
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      
      // Check if we should retry
      if (attempt === maxRetries || !shouldRetry(error)) {
        throw error
      }
      
      // Calculate delay with exponential backoff
      const delay = Math.min(
        initialDelay * Math.pow(factor, attempt),
        maxDelay
      )
      
      // Add jitter to prevent thundering herd
      const jitteredDelay = delay * (0.5 + Math.random() * 0.5)
      
      // Call retry callback
      onRetry({
        error,
        attempt: attempt + 1,
        maxRetries,
        delay: jitteredDelay,
        willRetry: attempt < maxRetries
      })
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, jitteredDelay))
    }
  }
  
  throw lastError
}

/**
 * Default retry checker for HTTP errors
 * @param {Error} error - The error to check
 * @returns {boolean} Whether the error is retryable
 */
export function isRetryableError(error) {
  // Don't retry rate limit errors - they have their own timing
  if (error.name === 'RateLimitError') {
    return false
  }
  
  // Retry network errors
  if (error.name === 'NetworkError' || error.message?.includes('fetch')) {
    return true
  }
  
  // Retry server errors (5xx)
  if (error.status >= 500 && error.status < 600) {
    return true
  }
  
  // Retry timeout errors
  if (error.name === 'TimeoutError' || error.message?.includes('timeout')) {
    return true
  }
  
  // Don't retry client errors (4xx) except for specific cases
  if (error.status >= 400 && error.status < 500) {
    // Retry 429 (Too Many Requests) with backoff
    if (error.status === 429) {
      return true
    }
    // Retry 408 (Request Timeout)
    if (error.status === 408) {
      return true
    }
    return false
  }
  
  // Default to retrying unknown errors
  return true
}

/**
 * Create a retryable version of a function
 * @param {Function} fn - The function to make retryable
 * @param {Object} defaultOptions - Default retry options
 * @returns {Function} Retryable version of the function
 */
export function makeRetryable(fn, defaultOptions = {}) {
  return async function retryableFunction(...args) {
    return retryWithBackoff(
      () => fn(...args),
      defaultOptions
    )
  }
}