import React from 'react'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { moods, _MOODS } from './data/moods'
import stores from './mocks/stores'
import App from './App'
import { setMood } from './actions/player'

const mockStore = configureStore([])

describe('App Component with initial Store state', () => {
  let component
  let store
  const welcomeMsg = 'Select a playlist with the buttons on the right!'

  beforeEach(() => {
    store = mockStore(stores.welcome)

    store.dispatch = jest.fn()

    component = render(
      <Provider store={store}>
        <App />
      </Provider>
    )
  })

  afterEach(() => {
    cleanup()
    component = null
    jest.restoreAllMocks()
  })

  it('should render with the given state from the Redux store', () => {
    expect(component).toMatchSnapshot()
  })

  it('should dispatch the correct action on softButton click', () => {
    const softButton = screen.getByText(_MOODS.rock)
    userEvent.click(softButton)

    // using Nth = 2 because the store dispaches the WindowSize event
    // automatically when the WindowDimensions component is mounted
    expect(store.dispatch).toHaveBeenNthCalledWith(2, setMood(moods[0].name))
  })

  it('sets the player correctly when clicking on mood button', () => {})
})
