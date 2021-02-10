const windowReducerDefaultState = {
    width: 0,
    height: 0
};

const getSizeName = (width) => {
    if ( width <= 440 ) {
        return 'xs';
    } else if ( width <= 768 ) {
        return 'sm';
        // return 'xs';
    } else if ( width > 768 && width < 1024 ) {
        return 'md';
    } else if ( width <= 1024 ) {
        return 'md';
    }
    // } else if ( width <= 1440 ) {
    //     return 'md';
     else {
        return 'lg';
    }
}

export default (state=windowReducerDefaultState, action) => {
    switch (action.type) {
        case 'SET_WINDOW_SIZE':
            return {
                ...state,
                width: action.width,
                height: action.height,
                size: getSizeName(action.width)
            };
        default:
            return state;
    }
}