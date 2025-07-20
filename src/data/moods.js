import { fetchTracksByMood } from '../services/jamendoApi'

export const _MOODS = {
  rock: 'ROCK',
  funk: 'FUNK',
  pop: 'POP'
}

// Static mood definitions (playlists will be loaded dynamically)
export const moods = [
  {
    name: _MOODS.rock,
    id: 'rock',
    playlist: null, // Will be populated by API
    loading: false,
    error: null
  },
  {
    name: _MOODS.funk,
    id: 'funk', 
    playlist: null, // Will be populated by API
    loading: false,
    error: null
  },
  {
    name: _MOODS.pop,
    id: 'pop',
    playlist: null, // Will be populated by API
    loading: false,
    error: null
  }
]

/**
 * Load playlist for a specific mood from Jamendo API
 * @param {string} moodId - The mood identifier ('rock', 'funk', 'pop')
 * @param {number} limit - Number of tracks to fetch
 * @returns {Promise<Array>} Array of track objects
 */
export const loadMoodPlaylist = async (moodId, limit = 10) => {
  try {
    const tracks = await fetchTracksByMood(moodId, limit)
    return tracks
  } catch (error) {
    console.error(`Error loading ${moodId} playlist:`, error)
    throw error
  }
}

/**
 * Get mood definition by name
 * @param {string} name - The mood display name
 * @returns {Object|undefined} Mood object
 */
export const getMood = name => {
  const result = moods.filter(mood => {
    return mood.name === name
  })
  return result[0]
}

/**
 * Get mood definition by ID
 * @param {string} id - The mood ID ('rock', 'funk', 'pop') 
 * @returns {Object|undefined} Mood object
 */
export const getMoodById = id => {
  return moods.find(mood => mood.id === id)
}

export default moods
