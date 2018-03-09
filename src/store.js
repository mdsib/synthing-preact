import { createStore } from 'redux';

const initialState = {
    volume: 0.7,
    bpm: 120,
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
    }
    return Object.assign({}, state, updates);
}

const store = createStore(reducer, initialState);

export default store;
export { store };
