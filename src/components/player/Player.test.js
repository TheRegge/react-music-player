import React from 'react'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import { cleanup, render, screen } from '@testing-library/react'
import { moods } from '../../data/moods'
import stores from '../../mocks/stores'
import Player from './Player'

const mockStore = configureStore([])

describe('Player Component with initial Store state', () => {
  let component
  let store
  const welcomeMsg = 'Select a playlist with the buttons on the right!'

  beforeEach(() => {
    store = mockStore(stores.welcome)
    store.dispatch = jest.fn()
    component = render(
      <Provider store={store}>
        <Player />
      </Provider>
    )
  })

  afterEach(() => {
    cleanup()
    component = null
    jest.restoreAllMocks()
  })

  it('renders the right amount of mood buttons', async () => {
    let btns = await screen.findAllByLabelText(/Select mood/)
    expect(btns.length).toEqual(moods.length)
  })

  it('renders the welcome message', () => {
    expect(screen.getByText(welcomeMsg)).toBeDefined()
  })
})

describe('Player component with the mood FUNK loaded, player paused', () => {
  let component
  let store

  beforeEach(() => {
    store = mockStore(stores.funkmood)
    store.dispatch = jest.fn()
    component = render(
      <Provider store={store}>
        <Player />
      </Provider>
    )
  })

  afterEach(() => {
    cleanup()
    component = null
    jest.restoreAllMocks()
  })

  it('shows the loading status', async () => {
    let loadingStatus = await screen.findByText(
      stores.funkmood.player.loadingStatus
    )
    expect(loadingStatus).toBeDefined()
  })

  it('displays the right number of music tracks', async () => {
    let tracks = await screen.findAllByLabelText(/Song track: /)
    expect(tracks.length).toEqual(stores.funkmood.player.mood.playlist.length)
  })
})
