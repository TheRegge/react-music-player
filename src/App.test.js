import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { cleanup, screen, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { moods, _MOODS } from './data/moods'
import App from './App'

const mockSetMood = vi.fn()

// Mock the bot detection module
vi.mock('./utils/botDetection', () => ({
  botDetector: {
    recordPageLoad: vi.fn(() => ({
      isSuspicious: false,
      loadCount: 1,
      timeWindow: 60000,
      threshold: 10
    }))
  }
}))

// Mock the contexts
vi.mock('./contexts/PlayerContext', () => ({
  usePlayer: () => ({
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
    playlistCache: {},
    setMood: mockSetMood,
    setPlayStatus: vi.fn(),
    setTrackNumber: vi.fn(),
    setLoadingStatus: vi.fn(),
    setPlayingStatus: vi.fn(),
  }),
  PlayerProvider: ({ children }) => children,
}))

vi.mock('./contexts/WindowContext', () => ({
  useWindow: () => ({
    size: 'lg',
    width: 1920,
    height: 1080,
  }),
  WindowProvider: ({ children }) => children,
}))

describe('App Component with initial state', () => {
  let component

  beforeEach(() => {
    component = render(<App />)
  })

  afterEach(() => {
    cleanup()
    component = null
    vi.clearAllMocks()
  })

  it('should render without crashing', () => {
    expect(component).toBeTruthy()
  })

  it('should render the Player component', () => {
    // Check that main player elements are present
    const playerElement = component.container.querySelector('.container')
    expect(playerElement).toBeInTheDocument()
  })

  it('should display header links', () => {
    const githubLink = screen.getByText('GitHub')
    const portfolioLink = screen.getByText('Portfolio')
    
    expect(githubLink).toBeInTheDocument()
    expect(portfolioLink).toBeInTheDocument()
    expect(githubLink.getAttribute('href')).toBe('https://github.com/TheRegge/react-music-player')
    expect(portfolioLink.getAttribute('href')).toBe('https://zaleman.co')
  })

  it('should have correct CSS classes based on window size', () => {
    const appElement = component.container.querySelector('.app')
    const containerElement = component.container.querySelector('.container')
    
    expect(appElement).toHaveClass('app', 'lg')
    expect(containerElement).toHaveClass('container', 'lg')
  })

  it('should render mood selection buttons', async () => {
    // Look for mood buttons (they should be rendered by the Player component)
    const rockButton = await screen.findByText(_MOODS.rock)
    const funkButton = await screen.findByText(_MOODS.funk)
    const popButton = await screen.findByText(_MOODS.pop)
    
    expect(rockButton).toBeInTheDocument()
    expect(funkButton).toBeInTheDocument()
    expect(popButton).toBeInTheDocument()
  })

  it('should call setMood when mood button is clicked', async () => {
    const user = userEvent.setup()
    const rockButton = await screen.findByLabelText(`Select mood ${_MOODS.rock}`)
    
    await user.click(rockButton)
    
    expect(mockSetMood).toHaveBeenCalledWith(moods[0].id)
  })
})
