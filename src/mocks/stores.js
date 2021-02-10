import playlists from '../data/playlists'

const stores = {}
stores.welcome = {
  player: {
    loadingStatus: '',
    mood: undefined,
    playStatus: 'STOPPED',
    playingStatus: {
      duration: 0,
      position: 0,
      trackNumber: 0
    }
  },
  window: {
    height: 700,
    size: 'lg',
    width: 1919
  }
}

stores.funkmood = {
  player: {
    mood: {
      name: 'funk',
      playlist: playlists.funk
    },
    playStatus: 'PAUSED',
    loadingStatus: 'Buffering 71%',
    trackNumber: 0,
    playingStatus: {
      position: 1594.992,
      duration: 117786
    }
  },
  window: {
    height: 700,
    size: 'lg',
    width: 1919
  }
}

export default stores
