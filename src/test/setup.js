// Test setup for Vitest
import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers)

// Clean up after each test
afterEach(() => {
  cleanup()
})

// Mock environment variables
global.process = global.process || {}
global.process.env = {
  ...global.process.env,
  NODE_ENV: 'test',
  VITE_USE_MOCK_DATA: 'true'
}

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
global.localStorage = localStorageMock

// Mock Howler.js
vi.mock('howler', () => ({
  Howl: vi.fn().mockImplementation(() => ({
    play: vi.fn(),
    pause: vi.fn(),
    stop: vi.fn(),
    unload: vi.fn(),
    volume: vi.fn(),
    duration: vi.fn(() => 120),
    seek: vi.fn(() => 0),
    state: vi.fn(() => 'loaded'),
    on: vi.fn(),
  })),
  Howler: {
    ctx: {
      createAnalyser: vi.fn(() => ({
        connect: vi.fn(),
        disconnect: vi.fn(),
        frequencyBinCount: 1024,
        fftSize: 2048,
        getByteFrequencyData: vi.fn()
      })),
      destination: {},
    },
    volume: vi.fn(),
    mute: vi.fn(),
    stop: vi.fn(),
    suspend: vi.fn(),
    resume: vi.fn(),
  }
}))

// Mock the audio analyzer hook
vi.mock('../hooks/useAudioAnalyzer', () => ({
  useAudioAnalyzer: () => ({
    frequencyData: { bass: 0, mid: 0, treble: 0 },
    isAnalyzing: false
  })
}))

// Mock the interference effect hook
vi.mock('../hooks/useInterferenceEffect', () => ({
  useCRTEffect: () => ({
    canvasRef: { current: null }
  })
}))

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})