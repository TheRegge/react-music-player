import React, { createContext } from 'react'
import { render } from '@testing-library/react'
import { PlayerProvider } from '../contexts/PlayerContext'
import { WindowProvider } from '../contexts/WindowContext'

// Create mock contexts for testing
const MockPlayerContext = createContext()
const MockWindowContext = createContext()

// Mock player context values
export const mockPlayerContext = {
  mood: undefined,
  playlist: undefined,
  moodObject: undefined,
  playStatus: 'STOPPED',
  loadingStatus: '',
  trackNumber: 0,
  playingStatus: { position: 0, duration: 0 },
  playlistLoading: false,
  playlistError: null,
  preloadingComplete: false,
  setMood: vi.fn(),
  setPlayStatus: vi.fn(),
  setTrackNumber: vi.fn(),
  setLoadingStatus: vi.fn(),
  setPlayingStatus: vi.fn(),
}

// Mock window context values
export const mockWindowContext = {
  size: 'lg',
  width: 1920,
  height: 1080,
}

// Mock player context with FUNK mood loaded
export const mockPlayerContextWithFunk = {
  ...mockPlayerContext,
  mood: 'FUNK',
  moodObject: {
    name: 'FUNK',
    id: 'funk',
    playlist: [
      {
        id: '1',
        title: 'Test Funk Song',
        artist: 'Test Artist',
        url: 'http://example.com/song.mp3',
        duration: 180000
      }
    ]
  },
  playlist: [
    {
      id: '1',
      title: 'Test Funk Song',
      artist: 'Test Artist',
      url: 'http://example.com/song.mp3',
      duration: 180000
    }
  ],
  playStatus: 'PAUSED',
  loadingStatus: 'Buffering 71%',
  trackNumber: 0,
  playingStatus: {
    position: 1594.992,
    duration: 117786
  }
}

// Custom render function that wraps with providers
export const renderWithProviders = (
  ui,
  {
    playerContextValue = mockPlayerContext,
    windowContextValue = mockWindowContext,
    ...renderOptions
  } = {}
) => {
  const Wrapper = ({ children }) => (
    <WindowProvider value={windowContextValue}>
      <PlayerProvider value={playerContextValue}>
        {children}
      </PlayerProvider>
    </WindowProvider>
  )

  return render(ui, { wrapper: Wrapper, ...renderOptions })
}

// Custom render function with actual providers
export const renderWithMockedProviders = (
  ui,
  {
    playerContextValue = mockPlayerContext,
    windowContextValue = mockWindowContext,
    ...renderOptions
  } = {}
) => {
  // Create mock providers that return the mock values
  const MockPlayerProvider = ({ children }) => (
    <MockPlayerContext.Provider value={playerContextValue}>
      {children}
    </MockPlayerContext.Provider>
  )

  const MockWindowProvider = ({ children }) => (
    <MockWindowContext.Provider value={windowContextValue}>
      {children}
    </MockWindowContext.Provider>
  )

  const Wrapper = ({ children }) => (
    <MockWindowProvider>
      <MockPlayerProvider>
        {children}
      </MockPlayerProvider>
    </MockWindowProvider>
  )

  return render(ui, { wrapper: Wrapper, ...renderOptions })
}

// Mock fetch for API tests
export const mockFetch = (responseData, ok = true, status = 200) => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok,
      status,
      json: () => Promise.resolve(responseData),
    })
  )
}

// Mock moods data for tests
export const mockMoodsData = [
  {
    name: 'ROCK',
    id: 'rock',
    playlist: null,
    loading: false,
    error: null
  },
  {
    name: 'FUNK',
    id: 'funk',
    playlist: null,
    loading: false,
    error: null
  },
  {
    name: 'POP',
    id: 'pop',
    playlist: null,
    loading: false,
    error: null
  }
]

// Helper to create mock track data
export const createMockTrack = (overrides = {}) => ({
  id: '1',
  title: 'Test Song',
  artist: 'Test Artist',
  album: 'Test Album',
  duration: 180000,
  url: 'http://example.com/song.mp3',
  audiodownload: 'http://example.com/song.mp3',
  artist_id: '123',
  album_id: '456',
  artist_url: 'https://www.jamendo.com/artist/123',
  track_url: 'https://www.jamendo.com/track/1',
  album_url: 'https://www.jamendo.com/album/456',
  license_ccurl: 'https://creativecommons.org/licenses/by-sa/3.0/',
  license_name: 'CC BY-SA',
  jamendo_track_id: '1',
  tags: ['funk'],
  release_date: '2023-01-01',
  image: null,
  ...overrides
})

// Re-export everything from testing-library
export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'