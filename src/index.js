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
    setPlaying: (newVal) => ({type: 'SET_GLOBAL_PLAYING', value: newVal}),
    setNumBeats: (newVal) => ({type: 'SET_GLOBAL_NUM_BEATS', value: newVal})
})(App);

const InformedApp = <Provider store={store}><ConnectedApp /></Provider>;

render(
    InformedApp,
    document.getElementById('root')
);
