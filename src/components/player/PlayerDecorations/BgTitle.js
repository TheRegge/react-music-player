import React from 'react'

const BgTitle = props => (
  <svg
    width={186}
    height={28}
    xmlnsXlink="http://www.w3.org/1999/xlink"
    className="bgTitle"
  >
    <defs>
      <path
        d="M25.833 26H2.583v-2.583H0V2.75h2.583V.167h23.25v5.166h-15.5v15.5H15.5v-5.166h-2.583V10.5h12.916V26zm31.332 0H46.832V15.667h-5.167V26H31.332V.167h23.25V2.75h2.583v7.75h-2.583v5.167h2.583V26zM46.832 10.5V5.333h-5.167V10.5h5.167zm41.666 12.917h-2.584V26H65.248v-2.583h-2.584V2.75h2.584V.167h20.666V2.75h2.584v20.667zm-10.334-2.584v-15.5h-5.166v15.5h5.166zm41.666 2.584h-2.584V26H96.58v-2.583h-2.584V2.75h2.584V.167h20.666V2.75h2.584v20.667zm-10.334-2.584v-15.5h-5.166v15.5h5.166zm41.666 2.584h-2.583V26h-23.25V.167h10.333v20.666h5.167V.167h10.333v23.25zm31.332-10.334h-2.583v2.584h-5.167V26h-10.333V15.667h-5.167v-2.584h-2.583V.167h10.333V10.5h5.167V.167h10.333v12.916z"
        id="bgtitle_b"
      />
      <filter
        x="-.8%"
        y="-5.8%"
        width="103.3%"
        height="119.4%"
        filterUnits="objectBoundingBox"
        id="bgtitle_a"
      >
        <feOffset dx={3} dy={2} in="SourceAlpha" result="shadowOffsetOuter1" />
        <feColorMatrix
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.985221809 0"
          in="shadowOffsetOuter1"
        />
      </filter>
      <filter
        x="-.3%"
        y="-1.9%"
        width="102.2%"
        height="111.6%"
        filterUnits="objectBoundingBox"
        id="bgtitle_c"
      >
        <feOffset dx={1} dy={1} in="SourceAlpha" result="shadowOffsetInner1" />
        <feComposite
          in="shadowOffsetInner1"
          in2="SourceAlpha"
          operator="arithmetic"
          k2={-1}
          k3={1}
          result="shadowInnerInner1"
        />
        <feColorMatrix
          values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.675289554 0"
          in="shadowInnerInner1"
        />
      </filter>
    </defs>
    <g fillRule="nonzero" fill="none">
      <use fill="#000" filter="url(#bgtitle_a)" xlinkHref="#bgtitle_b" />
      <use fill="#EA5454" xlinkHref="#bgtitle_b" />
      <use fill="#000" filter="url(#bgtitle_c)" xlinkHref="#bgtitle_b" />
    </g>
  </svg>
)

export default BgTitle
