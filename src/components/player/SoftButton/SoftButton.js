import React from 'react'
import { connect } from 'react-redux'
import { setMood, setTrackNumber, setPlayStatus } from '../../../actions/player'
import './softButton.css'

const SoftButton = props => {
  const onClickHandler = () => {
    props.setMood(props.mood)
    props.setTrackNumber(0)
    props.setPlayStatus('PLAYING')
  }

  const buttonFullHeight = 54 // 42px + 12px for shadow
  const buttonFullWidth = 112 // 100px + 12px for shadow

  return (
    <div
      onClick={onClickHandler}
      role="button"
      aria-label={`Select mood ${props.text}`}
      className="softButton_container"
    >
      <div className="softButton_text">{props.text}</div>
      <svg
        width={buttonFullWidth}
        height={buttonFullHeight}
        xmlnsXlink="http://www.w3.org/1999/xlink"
        className={props.className}
      >
        <defs>
          <rect id="softButton_b" x={0} y={0} width={100} height={42} rx={5} />
          <filter
            x="-7.5%"
            y="-22.6%"
            width="121%"
            height="150%"
            filterUnits="objectBoundingBox"
            id="softButton_a"
          >
            <feOffset
              dx={3}
              dy={1}
              in="SourceAlpha"
              result="shadowOffsetOuter1"
            />
            <feGaussianBlur
              stdDeviation={3}
              in="shadowOffsetOuter1"
              result="shadowBlurOuter1"
            />
            <feComposite
              in="shadowBlurOuter1"
              in2="SourceAlpha"
              operator="out"
              result="shadowBlurOuter1"
            />
            <feColorMatrix
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0"
              in="shadowBlurOuter1"
            />
          </filter>
          <linearGradient
            x1="2.593%"
            y1="42.573%"
            x2="100%"
            y2="57.427%"
            id="softButton_c"
          >
            <stop stopColor="#515A5B" offset="0%" />
            <stop stopColor="#4A6A6D" offset="64.801%" />
            <stop stopColor="#587C80" offset="100%" />
          </linearGradient>

          <filter
            x="-1.5%"
            y="-3.1%"
            width="105.9%"
            height="106.2%"
            filterUnits="objectBoundingBox"
            id="softButton_d"
          >
            <feOffset dx={1} in="SourceAlpha" result="shadowOffsetOuter1" />
            <feColorMatrix
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.285347465 0"
              in="shadowOffsetOuter1"
            />
          </filter>
        </defs>
        <g fill="none" fillRule="evenodd">
          <g>
            <use
              fill="#000"
              filter="url(#softButton_a)"
              xlinkHref="#softButton_b"
            />
            <rect
              stroke="#252C2D"
              strokeLinejoin="square"
              fill="#374142"
              x={0.5}
              y={0.5}
              width={99}
              height={41}
              rx={5}
            />
          </g>
          <path
            className="btn-top"
            d="M5 0h89a2 2 0 0 1 2 2v30a5 5 0 0 1-5 5H5a5 5 0 0 1-5-5V5a5 5 0 0 1 5-5z"
            fill="url(#softButton_c)"
          />
          <g fill="#CCC">
            <use
              filter="url(#softButton_d)"
              xlinkHref={`#${props.text}_softButton_e`}
            />
            <use xlinkHref={`#${props.text}_softButton_e`} />
          </g>
        </g>
      </svg>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    playerMood: state.player.mood ? state.player.mood.name : undefined
  }
}

const mapDispatchToProps = dispatch => ({
  setMood: mood => dispatch(setMood(mood)),
  setTrackNumber: num => dispatch(setTrackNumber(num)),
  setPlayStatus: status => dispatch(setPlayStatus(status))
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SoftButton)
