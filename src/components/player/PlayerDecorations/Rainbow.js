import React from 'react'

const Rainbow = props => (
  <svg width={149} height={197} className="rainbow">
    <defs>
      <linearGradient
        x1="90.666%"
        y1="9.075%"
        x2="100%"
        y2="9.075%"
        id="rainbow_a"
      >
        <stop stopColor="#E65454" offset="0%" />
        <stop stopColor="#AF2525" offset="100%" />
      </linearGradient>
      <linearGradient
        x1="100%"
        y1="14.321%"
        x2="89.316%"
        y2="14.321%"
        id="rainbow_b"
      >
        <stop stopColor="#B18228" offset="0%" />
        <stop stopColor="#EAB754" offset="100%" />
      </linearGradient>
      <linearGradient
        x1="100%"
        y1="15.534%"
        x2="86.376%"
        y2="15.534%"
        id="rainbow_c"
      >
        <stop stopColor="#338233" offset="0%" />
        <stop stopColor="#5DA65D" offset="100%" />
      </linearGradient>
      <linearGradient
        x1="100%"
        y1="22.548%"
        x2="81.991%"
        y2="22.548%"
        id="rainbow_d"
      >
        <stop stopColor="#3890BF" offset="0%" />
        <stop stopColor="#71C1EC" offset="100%" />
      </linearGradient>
    </defs>
    <g fill="none" fillRule="evenodd">
      <path
        fill="url(#rainbow_a)"
        d="M.715 197.054l149-197v34l-123 163z"
        transform="translate(-.715 -.054)"
      />
      <path
        fill="url(#rainbow_b)"
        d="M26.715 197.054h26.75l96.25-128v-35z"
        transform="translate(-.715 -.054)"
      />
      <path
        fill="url(#rainbow_c)"
        d="M53.466 197.054l96.25-128v30.884l-73 97.116z"
        transform="translate(-.715 -.054)"
      />
      <path
        fill="url(#rainbow_d)"
        d="M76.715 197.054l73-97.116v36.116l-46 61z"
        transform="translate(-.715 -.054)"
      />
    </g>
  </svg>
)

export default Rainbow
