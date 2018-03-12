import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import consts from './consts.js';

const initialState = {
    global: {
        volume: 0.7,
        bpm: 120,
        beat: 0,
        playing: false,
        numBeats: 4,
        editingToneIdx: 0
    },
    adsr: {
        attack: 0.3,
        decay: 1,
        sustain: 0.4,
        release: 1
    }
};

const adsrReducer = (state, action) => {
    const updates = {};
    const propertiesAllowed = consts.adsrProperties.map(val => val.name);
    switch (action.type) {
        case 'SET_ADSR_PROPERTY':
            console.log(action);
            if (propertiesAllowed.indexOf(action.property) > -1) {
                updates[action.property] = action.value
            }
            break;
        default:
            break;
    }
    return Object.assign({}, state, updates);
}

const globalReducer = (state, action) => {
    const updates = {};
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
        case 'SET_EDITING_TONE_IDX':
            updates.editingToneIdx = action.value;
            break;
        default:
            break;
    }
    return Object.assign({}, state, updates);
}

const reducers = {
    global: globalReducer,
    adsr: adsrReducer
};

const store = createStore(combineReducers(reducers), initialState, applyMiddleware(thunk));

export default store;
export { store };
