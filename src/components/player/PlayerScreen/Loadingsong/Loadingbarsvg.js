import React from 'react'

const Loadingbarsvg = props => (
  <svg width={260} height={4} {...props}>
    <rect width={260} height={4} fill={props.color} fillRule="evenodd" />
  </svg>
)

export default Loadingbarsvg
