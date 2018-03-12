import { h, render } from 'preact';
import App from './App';
import './index.css';
import 'preact/devtools';

import { Provider, connect } from 'preact-redux';
import { store } from './store.js';

const ConnectedApp = connect(state => state, {
    setVolume: (newVal) => ({type: 'SET_GLOBAL_VOLUME', value: newVal}),
    setBpm: (newVal) => ({type: 'SET_GLOBAL_BPM', value: newVal}),
    setBeat: (newVal) => ({type: 'SET_GLOBAL_BEAT', value: newVal}),
    setNumBeats: (newVal) => ({type: 'SET_GLOBAL_NUM_BEATS', value: newVal}),
    startMetro: () => (dispatch, getState) => {
        const tickMetro = {type: 'TICK_METRO'};
        const startMetro = {type: 'START_METRO'};

        dispatch(startMetro);

        const loop = () => {
            if (getState().playing) {
                dispatch(tickMetro);
                window.setTimeout(loop, (1 / getState().bpm) * 60000);
            }
        }

        loop();
    },
    stopMetro: () => ({type: 'STOP_METRO'})
})(App);

const InformedApp = <Provider store={store}><ConnectedApp /></Provider>;

render(
    InformedApp,
    document.getElementById('root')
);
