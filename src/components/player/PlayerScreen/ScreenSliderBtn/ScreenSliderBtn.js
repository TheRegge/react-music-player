import React from 'react';
import { useWindow } from '../../../../contexts/WindowContext';
import { motion } from 'framer-motion';
import ScreenSliderBtnSvg from './ScreenSliderBtnSvg';

const ScreenSliderBtn = (props) => {
    const { size: windowSize } = useWindow();
    
    let style = {position: 'absolute', zIndex: 120};

    switch(windowSize) {
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
        <motion.div
            className="screenSliderBtn"
            style={style}
            drag="y"
            dragConstraints={{ top: 0, bottom: 95 }}
            onDrag={(event, info) => {
                if (props.callback) {
                    props.callback(info.point.y);
                }
            }}
        >
            <ScreenSliderBtnSvg callback={props.callback} />
        </motion.div>
    );
};

export default ScreenSliderBtn;
