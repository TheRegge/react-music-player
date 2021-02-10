import React from 'react'

const ScreenBgLg = props => (
  <svg
    width={400}
    height={240}
    xmlnsXlink="http://www.w3.org/1999/xlink"
    {...props}
  >
    <defs>
      <linearGradient x1="100%" y1="68%" x2="0%" y2="32%" id="a">
        <stop stopColor="#5DB1B7" offset="0%" />
        <stop stopColor="#8BDFE5" offset="39.962%" />
        <stop stopColor="#68C8CE" offset="100%" />
      </linearGradient>
      <rect id="b" x={0} y={0} width={400} height={240} rx={3} />
      <filter
        x="-1.5%"
        y="-2.5%"
        width="103%"
        height="105%"
        filterUnits="objectBoundingBox"
        id="c"
      >
        <feGaussianBlur
          stdDeviation={4.5}
          in="SourceAlpha"
          result="shadowBlurInner1"
        />
        <feOffset
          dx={3}
          dy={3}
          in="shadowBlurInner1"
          result="shadowOffsetInner1"
        />
        <feComposite
          in="shadowOffsetInner1"
          in2="SourceAlpha"
          operator="arithmetic"
          k2={-1}
          k3={1}
          result="shadowInnerInner1"
        />
        <feColorMatrix
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.333451705 0"
          in="shadowInnerInner1"
        />
      </filter>
    </defs>
    <g fill="none" fillRule="evenodd">
      <use fill="url(#a)" xlinkHref="#b" />
      <use fill="#000" filter="url(#c)" xlinkHref="#b" />
      <path d="M0 42h400" stroke="#5FABBC" />
      <path d="M377 42v198" stroke="#5397B4" />
    </g>
  </svg>
)

export default ScreenBgLg
