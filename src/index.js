import { h, render } from 'preact';
import App from './App';
import './index.css';
import 'preact/devtools';

import { Provider, connect } from 'preact-redux';
import { store } from './store.js';

const ConnectedApp = connect(state => state, {
    setVol: (newVol) => ({type: 'SET_VOL', volume: newVol})
})(App);

const InformedApp = <Provider store={store}><ConnectedApp /></Provider>;

render(
    InformedApp,
    document.getElementById('root')
);
