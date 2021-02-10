import React from 'react'
import { connect } from 'react-redux'
import { setTrackNumber, setPlayStatus } from '../../../../actions/player'

import PlayBtn from './Playbtn/Playbtn'
import TextScroller from './TextScroller/TextScroller'

function Scroller(props) {
  const handleClick = index => {
    // 1 - this track was not selected before
    if (props.trackNumber !== index) {
      // set the player to play
      // set the current track to this index
      props.setPlayStatus('PLAYING')
      props.setTrackNumber(index)
    }

    // 2 - this track was selected and playing
    if (props.trackNumber === index && props.playStatus === 'PLAYING') {
      // pause the track
      props.setPlayStatus('PAUSED')
    }

    // 3 - this track was selected and paused
    if (props.trackNumber === index && props.playStatus === 'PAUSED') {
      // resume playing track
      props.setPlayStatus('PLAYING')
    }
  }

  return (
    <div
      id="playerScroller"
      className={`scroller ${props.windowSize}`}
      style={{ top: props.scroll }}
    >
      {props.playlist.map((song, index) => {
        const playing = props.trackNumber === index
        const listItemClasses = playing ? 'listItem playing' : 'listItem'
        return (
          <div
            key={`${song}-${index}`}
            onClick={() => {
              handleClick(index)
            }}
            className={listItemClasses}
            aria-label={`Song track: ${song.title}`}
          >
            {index + 1}.{' '}
            <TextScroller text={song.title} playing={playing} width={285} />
            <PlayBtn index={index} />
          </div>
        )
      })}
    </div>
  )
}
const mapStateToProps = state => {
  return {
    playlist: state.player.mood.playlist,
    playStatus: state.player.playStatus,
    trackNumber: state.player.trackNumber,
    windowSize: state.window.size
  }
}

const mapDispatchToProps = dispatch => ({
  setTrackNumber: num => dispatch(setTrackNumber(num)),
  setPlayStatus: status => dispatch(setPlayStatus(status))
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Scroller)
