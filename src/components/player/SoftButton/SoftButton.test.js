import React from 'react'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import { cleanup, render, screen } from '@testing-library/react'
import { moods, _MOODS } from '../../../data/moods'
import stores from '../../../mocks/stores'
import SoftButton from './SoftButton'

const mockStore = configureStore([])

describe('Soft button, welcome state', () => {
  let container
  let store
  let buttonSpy

  beforeEach(() => {
    store = mockStore(stores.welcome)
    store.dispatch = jest.fn()

    container = render(
      <Provider store={store}>
        <SoftButton
          className="softButton"
          text={moods[0].name}
          mood={moods[0].name}
        />
      </Provider>
    )
  })

  afterEach(() => {
    cleanup()
    container = null
    jest.restoreAllMocks()
  })

  it('renders without crashing', () => {
    expect(container).toBeTruthy()
  })

  it('renders the correct button text', () => {
    const textEls = screen.getAllByText(moods[0].name)
    expect(textEls.length).toEqual(1)
  })
})
