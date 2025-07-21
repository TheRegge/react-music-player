// Jamendo API Service
// API Documentation: https://developer.jamendo.com/v3.0

import { checkRateLimit, recordApiCall, formatTimeRemaining } from '../utils/rateLimiter'
import { retryWithBackoff, isRetryableError } from '../utils/retryWithBackoff'

const JAMENDO_API_BASE = 'https://api.jamendo.com/v3.0'
const CLIENT_ID = import.meta.env.VITE_JAMENDO_CLIENT_ID

// Development mode flag
const USE_MOCK_DATA = import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_DATA === 'true'

// Lazy load mock data only when needed
let mockData = null
const getMockData = async () => {
  if (!mockData) {
    mockData = await import('./mockData.json')
  }
  return mockData.default || mockData
}

// Genre mapping from our moods to Jamendo tags
const GENRE_MAPPING = {
  rock: ['rock', 'hardrock', 'indierock', 'alternative'],
  funk: ['funk', 'soul', 'jazz', 'blues'],
  pop: ['pop', 'dance', 'electronic', 'synthpop']
}

class JamendoApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'JamendoApiError'
    this.status = status
  }
}

class RateLimitError extends Error {
  constructor(message, resetIn) {
    super(message)
    this.name = 'RateLimitError'
    this.resetIn = resetIn
  }
}

/**
 * Fetch tracks from Jamendo API by genre/mood
 * @param {string} mood - The mood/genre ('rock', 'funk', 'pop')
 * @param {number} limit - Number of tracks to fetch (default: 10)
 * @returns {Promise<Array>} Array of track objects
 */
export const fetchTracksByMood = async (mood, limit = 10) => {
  try {
    // Use mock data in development if enabled
    if (USE_MOCK_DATA) {
      console.log(`[Mock Mode] Fetching ${mood} tracks from mock data`)
      const data = await getMockData()
      
      if (data.moods && data.moods[mood]) {
        const tracks = data.moods[mood].tracks || []
        // Return only the requested number of tracks
        return transformTracksData(tracks.slice(0, limit))
      }
      
      // Fallback to empty array if mood not found in mock data
      console.warn(`[Mock Mode] Mood '${mood}' not found in mock data`)
      return []
    }
    
    // Check rate limit before making API call
    const rateLimit = checkRateLimit()
    if (!rateLimit.allowed) {
      const timeRemaining = formatTimeRemaining(rateLimit.resetIn)
      throw new RateLimitError(
        `API rate limit exceeded. Please try again in ${timeRemaining}.`,
        rateLimit.resetIn
      )
    }
    
    // Original API call logic
    const genres = GENRE_MAPPING[mood] || [mood]
    const tagsQuery = genres.join(' ')
    
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      format: 'json',
      limit: limit.toString(),
      fuzzytags: tagsQuery,
      include: 'licenses+musicinfo',
      audioformat: 'mp32', // Standard quality MP3
      order: 'popularity_total'
    })

    // Wrap API call in retry logic
    const fetchWithRetry = async () => {
      // Record the API call
      recordApiCall()
      
      const response = await fetch(`${JAMENDO_API_BASE}/tracks/?${params}`)
      
      if (!response.ok) {
        throw new JamendoApiError(`HTTP error! status: ${response.status}`, response.status)
      }

      const data = await response.json()
      
      if (data.headers?.status !== 'success') {
        throw new JamendoApiError(`API error: ${data.headers?.error_message || 'Unknown error'}`)
      }

      return data
    }
    
    // Execute with retry logic
    const data = await retryWithBackoff(fetchWithRetry, {
      maxRetries: 3,
      initialDelay: 1000,
      shouldRetry: isRetryableError,
      onRetry: ({ attempt, maxRetries, delay }) => {
        console.log(`Retrying Jamendo API call (attempt ${attempt}/${maxRetries}) after ${Math.round(delay)}ms...`)
      }
    })

    return transformTracksData(data.results || [])
  } catch (error) {
    console.error('Error fetching tracks from Jamendo:', error)
    throw error
  }
}

/**
 * Transform Jamendo API response to our track format
 * @param {Array} jamendoTracks - Raw tracks from Jamendo API
 * @returns {Array} Transformed track objects
 */
const transformTracksData = (jamendoTracks) => {
  return jamendoTracks.map(track => ({
    // Basic track info
    id: track.id,
    title: track.name,
    artist: track.artist_name,
    album: track.album_name,
    duration: track.duration * 1000, // Convert to milliseconds
    
    // Audio URL
    url: track.audio,
    audiodownload: track.audiodownload,
    
    // Attribution & licensing
    artist_id: track.artist_id,
    album_id: track.album_id,
    artist_url: `https://www.jamendo.com/artist/${track.artist_id}`,
    track_url: `https://www.jamendo.com/track/${track.id}`,
    album_url: `https://www.jamendo.com/album/${track.album_id}`,
    
    // Creative Commons license info
    license_ccurl: track.license_ccurl || 'https://creativecommons.org/licenses/by-sa/3.0/',
    license_name: getLicenseName(track.license_ccurl),
    
    // Additional metadata
    jamendo_track_id: track.id,
    tags: track.musicinfo?.tags?.genres || [],
    release_date: track.releasedate,
    
    // Image/artwork
    image: track.album_image || track.artist_image || null
  }))
}

/**
 * Get human-readable license name from CC URL
 * @param {string} ccurl - Creative Commons license URL
 * @returns {string} Human-readable license name
 */
const getLicenseName = (ccurl) => {
  if (!ccurl) return 'CC BY-SA'
  
  if (ccurl.includes('/by-sa/')) return 'CC BY-SA'
  if (ccurl.includes('/by-nc-sa/')) return 'CC BY-NC-SA'
  if (ccurl.includes('/by-nc-nd/')) return 'CC BY-NC-ND'
  if (ccurl.includes('/by-nc/')) return 'CC BY-NC'
  if (ccurl.includes('/by-nd/')) return 'CC BY-ND'
  if (ccurl.includes('/by/')) return 'CC BY'
  
  return 'CC License'
}

/**
 * Search tracks by query string
 * @param {string} query - Search query
 * @param {number} limit - Number of results (default: 20)
 * @returns {Promise<Array>} Array of track objects
 */
export const searchTracks = async (query, limit = 20) => {
  try {
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      format: 'json',
      limit: limit.toString(),
      search: query,
      include: 'licenses+musicinfo',
      audioformat: 'mp32',
      order: 'relevance'
    })

    const response = await fetch(`${JAMENDO_API_BASE}/tracks/?${params}`)
    
    if (!response.ok) {
      throw new JamendoApiError(`HTTP error! status: ${response.status}`, response.status)
    }

    const data = await response.json()
    
    if (data.headers?.status !== 'success') {
      throw new JamendoApiError(`API error: ${data.headers?.error_message || 'Unknown error'}`)
    }

    return transformTracksData(data.results || [])
  } catch (error) {
    console.error('Error searching tracks on Jamendo:', error)
    throw error
  }
}

/**
 * Get track details by ID
 * @param {string} trackId - Jamendo track ID
 * @returns {Promise<Object>} Track object
 */
export const getTrackById = async (trackId) => {
  try {
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      format: 'json',
      id: trackId,
      include: 'licenses+musicinfo',
      audioformat: 'mp32'
    })

    const response = await fetch(`${JAMENDO_API_BASE}/tracks/?${params}`)
    
    if (!response.ok) {
      throw new JamendoApiError(`HTTP error! status: ${response.status}`, response.status)
    }

    const data = await response.json()
    
    if (data.headers?.status !== 'success') {
      throw new JamendoApiError(`API error: ${data.headers?.error_message || 'Unknown error'}`)
    }

    const tracks = transformTracksData(data.results || [])
    return tracks[0] || null
  } catch (error) {
    console.error('Error fetching track by ID from Jamendo:', error)
    throw error
  }
}

export { JamendoApiError, RateLimitError }