import React from 'react';
import { connect } from 'react-redux';
import posed from 'react-pose';
import ScreenSliderBtnSvg from './ScreenSliderBtnSvg';


const MyComponent = React.forwardRef((props, ref) => {

    let style = {position: 'absolute', zIndex: 120};

    switch(props.windowSize) {
        case 'md':
        case 'lg':
            style.left = 439;
            style.top = 120;
            break;
        case 'sm':
        case 'xs':
            style.left = 344;
            style.top = 28;
            break;
        default:
        style.left = 200;
        style.top = 40;
    }



    return (
    <ScreenSliderBtnSvg
        className="screenSliderBtn"
        ref={ref}
        style={style}
       callback={props.callback}
    />
  )});

  const PosedComponent = posed(MyComponent)({
    draggable: 'y',
    dragBounds: {top: 0, bottom: 95}
  });


  const mapStateToProps = (state) => ({
      windowSize: state.window.size
  });
  const Connected = connect(mapStateToProps)(PosedComponent);

  export default (props) => <Connected
    onValueChange={{ y: props.callback }}
/>;
