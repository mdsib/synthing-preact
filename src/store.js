import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

const initialState = {
    volume: 0.7,
    bpm: 120,
    beat: 0,
    playing: false,
    numBeats: 4
};

const reducer = (state, action) => {
    let updates = {};
    switch (action.type) {
        case 'SET_GLOBAL_VOLUME':
            updates.volume = action.value;
            break;
        case 'SET_GLOBAL_BPM':
            updates.bpm = action.value;
            break;
        case 'SET_GLOBAL_BEAT':
            updates.beat = action.value;
            break;
        case 'SET_GLOBAL_NUM_BEATS':
            updates.numBeats = action.value;
            break;
        case 'START_METRO':
            updates.playing = true;
            break;
        case 'TICK_METRO':
            updates.beat = (state.beat + 1) % state.numBeats;
            break;
        case 'STOP_METRO':
            updates.playing = false;
            updates.beat = 0;
            break;
        default:
            break;
    }
    return Object.assign({}, state, updates);
}

const store = createStore(reducer, initialState, applyMiddleware(thunk));

export default store;
export { store };
