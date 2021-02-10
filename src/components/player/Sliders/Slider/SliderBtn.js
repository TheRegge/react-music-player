import React from 'react'

const SliderBtn = props => {
  const color = props.color || '#E83636'
  return (
    <svg
      width={12}
      height={12}
      xmlnsXlink="http://www.w3.org/1999/xlink"
      {...props}
    >
      <defs>
        <circle id="sliderBtn_b" cx={4} cy={4} r={2} />
        <filter
          x="-150%"
          y="-150%"
          width="400%"
          height="400%"
          filterUnits="objectBoundingBox"
          id="sliderBtn_a"
        >
          <feOffset in="SourceAlpha" result="shadowOffsetOuter1" />
          <feGaussianBlur
            stdDeviation={2}
            in="shadowOffsetOuter1"
            result="shadowBlurOuter1"
          />
          <feColorMatrix
            values="0 0 0 0 0.897871377 0 0 0 0 0.254322752 0 0 0 0 0.254322752 0 0 0 0.739974869 0"
            in="shadowBlurOuter1"
          />
        </filter>
      </defs>
      <g transform="translate(2 2)" fill="none" fillRule="evenodd">
        <use fill="#000" filter="url(#sliderBtn_a)" xlinkHref="#sliderBtn_b" />
        <use fill={color} xlinkHref="#sliderBtn_b" />
      </g>
    </svg>
  )
}

export default SliderBtn
