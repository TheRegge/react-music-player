import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import './playList.css'
import Scroller from './Scroller'

const PlayList = props => {
  const getScrollerHeight = height => {
    props.getHeight(height)
  }

  const scrollToTop = el => {
    if (typeof el.scrollTo === 'function') {
      el.scrollTo(0, 0)
    }
  }

  useEffect(() => {
    //   scroll to the first track on mood change
    scrollToTop(document.getElementById('playlist'))
  }, [props.mood])

  return (
    <div id="playlist" className={`playList ${props.windowSize}`}>
      <Scroller scroll={props.scroll} getHeight={getScrollerHeight} />
    </div>
  )
}

const mapStateToProps = state => ({
  mood: state.player.mood,
  windowSize: state.window.size
})

export default connect(mapStateToProps)(PlayList)
