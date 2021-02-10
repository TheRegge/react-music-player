import { useEffect } from 'react'
import { connect } from 'react-redux'
import { setWindowSize } from '../actions/window'

function WindowDimensions(props) {
  const updateDimensions = () => {
    props.setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    })
  }

  useEffect(() => {
    updateDimensions()
    window.addEventListener('resize', updateDimensions)

    //   cleanup
    return () => {
      window.removeEventListener('resize', updateDimensions)
    }
  })

  return null
}

const mapDispatchToProps = dispatch => ({
  setWindowSize: dimensions => dispatch(setWindowSize(dimensions))
})
export default connect(
  undefined,
  mapDispatchToProps
)(WindowDimensions)
