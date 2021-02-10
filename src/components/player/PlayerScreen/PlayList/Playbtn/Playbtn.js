import React from 'react'
import { connect } from 'react-redux'
import './playbtn.css'
import Playbtnsvg from './PlayBtnsvg'
import Pausebtnsvg from './PauseBtnsvg'

class PlayBtn extends React.Component {
  render() {
    // Get the button 'playing' status
    const playing =
      this.props.trackNumber === this.props.index &&
      this.props.playStatus === 'PLAYING'
    return (
      <div className="playBtn">
        {!playing && <Playbtnsvg width="18px" height="18px"></Playbtnsvg>}
        {playing && <Pausebtnsvg width="18px" height="18px"></Pausebtnsvg>}
      </div>
    )
  }
}
const mapStateToProps = state => {
  return {
    playStatus: state.player.playStatus,
    trackNumber: state.player.trackNumber
  }
}

export default connect(mapStateToProps)(PlayBtn)
