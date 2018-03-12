import { h, render } from 'preact';
import App from './App';
import './index.css';
import 'preact/devtools';

import { Provider, connect } from 'preact-redux';
import { store } from './store.js';

const ConnectedApp = connect(state => Object.assign({}, state.global, {adsr: state.adsr}), {
    setVolume: (value) => ({type: 'SET_GLOBAL_VOLUME', value}),
    setBpm: (value) => ({type: 'SET_GLOBAL_BPM', value}),
    setBeat: (value) => ({type: 'SET_GLOBAL_BEAT', value}),
    setNumBeats: (value) => ({type: 'SET_GLOBAL_NUM_BEATS', value}),
    setEditingToneIdx: (value) => ({type: 'SET_EDITING_TONE_IDX', value}),
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
    stopMetro: () => ({type: 'STOP_METRO'}),
    setAdsrProperty: (property, value) => ({type: 'SET_ADSR_PROPERTY', property, value})
})(App);

const InformedApp = <Provider store={store}><ConnectedApp /></Provider>;

render(
    InformedApp,
    document.getElementById('root')
);
