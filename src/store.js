import { createStore } from 'redux';

const initialState = {
    volume: 0.7
};

const reducer = (state, action) => {
    let updates = {};
    if (action.type === 'SET_VOL') {
        updates.volume = action.volume;
    }
    return Object.assign({}, state, updates);
}

const store = createStore(reducer, initialState);

export default store;
export { store };
