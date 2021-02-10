import React from 'react'
import { connect } from 'react-redux'
import './textscroller.css'

class TextScroller extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      scrollable: false
    }
  }
  componentDidMount = () => {
    const width = this.refs.songTitle.scrollWidth
    if (width > this.props.width) {
      this.setState({ scrollable: true })
    }
  }

  render() {
    const textClasses =
      this.state.scrollable && this.props.playing
        ? `songTitle scrolling ${this.props.windowSize}`
        : 'songTitle'
    return (
      <div className="textScroller">
        <div className={textClasses} ref="songTitle">
          {this.props.text}
        </div>
      </div>
    )
  }
}
const mapStateToProps = state => ({
  windowSize: state.window.size
})
export default connect(mapStateToProps)(TextScroller)
