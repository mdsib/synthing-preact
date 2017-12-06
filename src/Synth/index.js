import { Component } from 'preact';
import Polyphonic from '../Polyphonic';
import AudioKeys from '../../AudioKeys/dist/audiokeys.js';

export default class Synth extends Component {
    componentWillMount() {
        startAudio();
    }
    componentWillUpdate() {
        return false;
    }
    componentWillReceiveProps(newProps) {
        updateAudio(newProps.waveform);
    }
    render() {
        return null;
   } 
}

const ac = new AudioContext();
const P = new Polyphonic(ac);

function startAudio() {
    var keyboard = new AudioKeys({polyphony: 3});

    keyboard.down((note) => {
        P.addVoice(note);
    });
    keyboard.up((note) => {
        P.removeVoice(note);
    });
}

function updateAudio(waveform) {
    P.changeWave(waveform);
}
