import { h } from 'preact';
import keymage from 'keymage';
import { store } from '../store.js';

const keybindings = {
    'shift-/': () => {store.dispatch({type: 'TOGGLE_HELP_OPEN'})},
    'space': {
        'a': () => {console.log('a pressed after space')}
    }
}

const getPrefix = (key, prefix) => prefix ? `${prefix} ${key}` : key;
const registerAll = (keys, prefix) => {
    for (let key of Object.keys(keys)) {
        if (typeof(keys[key]) === "function") {
            keymage(getPrefix(key, prefix), keys[key]);
        }
        else if (typeof(keys[key]) === "object") {
            registerAll(keys[key], getPrefix(key, prefix));
        }
    }
}
registerAll(keybindings);

export default () => (<div>{keybindings}</div>)
