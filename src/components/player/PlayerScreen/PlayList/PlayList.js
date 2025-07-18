import React, { useEffect } from 'react'
import { usePlayer } from '../../../../contexts/PlayerContext'
import { useWindow } from '../../../../contexts/WindowContext'
import './playList.css'
import Scroller from './Scroller'

const PlayList = props => {
  const { moodObject } = usePlayer()
  const { size: windowSize } = useWindow()
  
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
  }, [moodObject])

  return (
    <div id="playlist" className={`playList ${windowSize}`}>
      <Scroller scroll={props.scroll} getHeight={getScrollerHeight} />
    </div>
  )
}

export default PlayList
