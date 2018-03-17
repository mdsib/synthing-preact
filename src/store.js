import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import consts from './consts.js';
import helpers from './helpers.js';

const numBeats = 4;
const initialState = {
    volume: 0.7,
    bpm: 120,
    beat: 0,
    playing: false,
    numBeats,
    editingToneIdx: 0,
    helpOpen: false,
    adsr: {
        attack: 0.3,
        decay: 1,
        sustain: 0.4,
        release: 1
    },
    tones: [{
        active: true,
        waveform: consts.initialWave.slice(),
        mix: 0.7,
        mute: false,
        solo: false,
        beats: helpers.boolArray.update(helpers.boolArray.create(numBeats), 0, true)
    }],
};

const newTone = {
    active: false,
    waveform: consts.initialWave.slice(),
    mix: 0.7,
    mute: false,
    solo: false,
    beats: helpers.boolArray.create(numBeats)
};

const adsrReducer = (state, action) => {
    const updates = {};
    const propertiesAllowed = consts.adsrProperties.map(val => val.name);
    switch (action.type) {
        case 'SET_ADSR_PROPERTY':
            if (propertiesAllowed.indexOf(action.property) > -1) {
                updates[action.property] = action.value
            }
            break;
        default:
            break;
    }
    return Object.assign({}, state, updates);
};

const tonesReducer = (state = [], action) => {
    switch (action.type) {
        case 'ADD_TONE':
            // idx: optional, defaults to end
            // waveform: optional, defaults to sine wave
            // activate: optional, defaults active to false
            const idx = action.idx === undefined ? state.length : action.idx;

            const newToneProps = {};
            if (action.waveform)
                newToneProps.waveform = action.waveform;
            if (action.activate)
                newToneProps.active = true;

            return helpers.immObjArray.add(
                state,
                idx,
                Object.assign({}, newTone, newToneProps)
            );
        case 'SET_TONE_PROPERTY':
            // idx: required
            // property: required
            // value: required
            const propertiesAllowed = Object.keys(initialState.tones[0]);
            if (propertiesAllowed.indexOf(action.property) > -1) {
                return helpers.immObjArray.update(state, action.idx, {
                    [action.property]: action.value
                });
            }
            else return state;
        case 'DELETE_TONE':
            // idx: required
            return helpers.immObjArray.remove(state, action.idx);
        case 'SET_GLOBAL_NUM_BEATS':
            // TODO save beats and just change the view, instead of deleting them
            return state.map((val, idx) => {
                let ret = Object.assign({}, val, {
                    beats: helpers.boolArray.setLength(val.beats, action.value)
                });
                return ret;
            });
        default:
            return state;
    }
};

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
        case 'DELETE_TONE':
            updates.editingToneIdx = Math.min(
                state.editingToneIdx,
                // 1 for length, 1 for deleted tone.
                // min length of tones array should be 2 before a delete...
                state.tones.length - 2
            );
            break;
        case 'SET_HELP_OPEN':
            updates.helpOpen = action.value;
            break;
        case 'TOGGLE_HELP_OPEN':
            updates.helpOpen = !state.helpOpen;
            break;
        default:
            break;
    }
    return Object.assign({}, state, updates);
}

const reducer = (state = initialState, action) => {
    return Object.assign({}, state, globalReducer(state, action), {
        tones: tonesReducer(state.tones, action),
        adsr: adsrReducer(state.adsr, action)
    });
};

const store = createStore(reducer, initialState, applyMiddleware(thunk));

export default store;
export { store };
