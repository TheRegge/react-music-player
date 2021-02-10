import playlists from './playlists'

export const _MOODS = {
  rock: 'rock 🎸',
  funk: 'funk 🎷',
  pop: 'pop 🎤'
}

export const moods = [
  {
    name: _MOODS.rock,
    playlist: playlists.rock
  },
  {
    name: _MOODS.funk,
    playlist: playlists.funk
  },
  {
    name: _MOODS.pop,
    playlist: playlists.pop
  }
]

export const getMood = name => {
  const result = moods.filter(mood => {
    return mood.name === name
  })
  return result[0]
}

export default moods
