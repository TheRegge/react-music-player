import React from 'react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { cleanup, screen, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { moods, _MOODS } from '../../../data/moods'
import SoftButton from './SoftButton'

const mockSetMood = vi.fn()

// Mock the context
vi.mock('../../../contexts/PlayerContext', () => ({
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
}))

describe('SoftButton Component', () => {
  let container

  beforeEach(() => {
    container = render(
      <SoftButton
        className="softButton"
        text={moods[0].name}
        moodId={moods[0].id}
      />
    )
  })

  afterEach(() => {
    cleanup()
    container = null
    vi.clearAllMocks()
  })

  it('renders without crashing', () => {
    expect(container).toBeTruthy()
  })

  it('renders the correct button text', () => {
    const textEls = screen.getAllByText(moods[0].name)
    expect(textEls.length).toEqual(1)
  })

  it('has the correct aria-label', () => {
    const button = screen.getByLabelText(`Select mood ${moods[0].name}`)
    expect(button).toBeInTheDocument()
  })

  it('applies the correct CSS class', () => {
    const button = screen.getByRole('button')
    expect(button).toHaveClass('softButton_container')
  })

  it('calls setMood when clicked', async () => {
    const user = userEvent.setup()
    const button = screen.getByRole('button')
    
    await user.click(button)
    
    expect(mockSetMood).toHaveBeenCalledWith(moods[0].id)
  })

  it('renders with different mood props', () => {
    cleanup()
    
    render(
      <SoftButton
        className="softButton"
        text={_MOODS.funk}
        moodId="funk"
      />
    )

    const funkButton = screen.getByText(_MOODS.funk)
    const funkLabel = screen.getByLabelText(`Select mood ${_MOODS.funk}`)
    
    expect(funkButton).toBeInTheDocument()
    expect(funkLabel).toBeInTheDocument()
  })
})
