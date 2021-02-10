import React from "react";
import { forwardRef } from 'react';

const ScreenSliderBtnSvg = forwardRef((props, ref) => (
  <svg width={26} height={40} ref={ref} {...props}>
    <g fill="none" fillRule="evenodd">
      <path
        d="M13.846 39.426h-1.81c-5.88 0-10.676-4.796-10.676-10.677V18.073c0-5.881 4.796-10.677 10.677-10.677h1.81c5.88 0 10.676 4.796 10.676 10.677v10.676c0 5.79-4.796 10.677-10.677 10.677z"
        fill="#3D73A7"
        opacity={0.34}
      />
      <path
        d="M13.756 32.278h-1.72c-5.971 0-10.766-4.886-10.766-10.767v-8.686c0-5.972 4.885-10.767 10.767-10.767h1.719c5.971 0 10.767 4.886 10.767 10.767v8.686c0 5.971-4.886 10.767-10.767 10.767z"
        stroke="#3D46A7"
        strokeWidth={2.268}
        fill="#9DFCF2"
      />
    </g>
  </svg>
));

export default ScreenSliderBtnSvg;

