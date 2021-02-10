import React from 'react'

const PlayerBgLg = props => (
  <svg
    viewBox="0 0 600 417"
    preserveAspectRatio="none"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    {...props}
  >
    <defs>
      <linearGradient
        x1="0%"
        y1="48.527%"
        x2="100%"
        y2="51.473%"
        id="playerBgLg_a"
      >
        <stop stopColor="#353435" offset="0%" />
        <stop stopColor="#403E40" offset="53.611%" />
        <stop offset="100%" />
      </linearGradient>
      <linearGradient
        x1="0%"
        y1="36.306%"
        x2="100%"
        y2="63.694%"
        id="playerBgLg_b"
      >
        <stop stopColor="#1D1A1E" offset="0%" />
        <stop stopColor="#3F373F" offset="23.874%" />
        <stop stopColor="#111011" offset="100%" />
      </linearGradient>
      <path
        d="M0 103h600v309a5 5 0 0 1-5 5H5a5 5 0 0 1-5-5V103z"
        id="playerBgLg_c"
      />
      <filter
        x="-1.7%"
        y="-3.2%"
        width="103.3%"
        height="106.4%"
        filterUnits="objectBoundingBox"
        id="playerBgLg_d"
      >
        <feGaussianBlur
          stdDeviation={7}
          in="SourceAlpha"
          result="shadowBlurInner1"
        />
        <feOffset dy={6} in="shadowBlurInner1" result="shadowOffsetInner1" />
        <feComposite
          in="shadowOffsetInner1"
          in2="SourceAlpha"
          operator="arithmetic"
          k2={-1}
          k3={1}
          result="shadowInnerInner1"
        />
        <feColorMatrix
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.294334572 0"
          in="shadowInnerInner1"
        />
      </filter>
    </defs>
    <g fill="none" fillRule="evenodd">
      <path
        d="M6.41 0h587.18c2.23 0 3.037.232 3.852.668a4.543 4.543 0 0 1 1.89 1.89c.436.815.668 1.623.668 3.852V103H0V6.41c0-2.23.232-3.037.668-3.852a4.543 4.543 0 0 1 1.89-1.89C3.373.232 4.18 0 6.41 0z"
        fill="url(#playerBgLg_a)"
      />
      <use fill="url(#playerBgLg_b)" xlinkHref="#playerBgLg_c" />
      <use fill="#000" filter="url(#d)" xlinkHref="#playerBgLg_c" />
    </g>
  </svg>
)

export default PlayerBgLg
