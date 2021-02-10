import React from 'react'

import Slider from './Slider/Slider'

const Sliders = () => {
  const top = 14
  const spacing = 22

  return (
    <>
      <Slider top={top} right={29} position="top" color="#E65454" />
      <Slider
        top={top + spacing}
        right={29}
        position="middle"
        color="#EAB653"
      />
      <Slider
        top={top + spacing * 2}
        right={29}
        position="bottom"
        color="#5EA65E"
      />
    </>
  )
}

export default Sliders
