import { Component } from 'preact';
import Polyphonic from '../Polyphonic';
import AudioKeys from '../../AudioKeys/dist/audiokeys.js';
import consts from '../consts.js';
import DSP from 'dsp.js';
const FFT = new DSP.FFT(consts.BUF_SIZE);

const ac = new AudioContext();
const P = new Polyphonic(ac);

export default class Synth extends Component {
    startAudio() {
        var keyboard = new AudioKeys({polyphony: 3});
        keyboard.down((note) => {
            P.addVoice(note, this.props.adsr);
        });
        keyboard.up((note) => {
            P.removeVoice(note);
        });
    }
    componentWillMount() {
        this.startAudio();
    }
    componentWillUpdate() {
        return false;
    }
    componentWillReceiveProps(newProps) {
        updateAudio(newProps.waveform);
        if (newProps.volume !== this.props.volume) {
            P.setVolume(newProps.volume);
        }
    }
    render() {
        return null;
   }
}

const taperOff = (length, val, i) => {
    return val * (1 - Math.pow(i / length, 0.5));
}

function updateAudio(waveform) {
    FFT.forward(waveform);
    const periodicWave = ac.createPeriodicWave(
        new Float32Array(FFT.real.map(taperOff.bind(null, FFT.real.length))),
        new Float32Array(FFT.imag.map(taperOff.bind(null, FFT.imag.length)))
    );
    P.changeWave(periodicWave);
}
