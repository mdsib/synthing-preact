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
        updateAudio(newProps.waveforms);
    }
    render() {
        return null;
   } 
}

function combineWaveforms(waveforms) {
    const res = new Array(consts.BUF_SIZE).fill(0);
    waveforms.forEach((waveform) => {
        waveform.forEach((amplitude, idx) => {
            res[idx] += amplitude;
        })
    })
    return res;
}

function updateAudio(waveforms) {
    const waveform = combineWaveforms(waveforms);
    FFT.forward(waveform);
    const periodicWave = ac.createPeriodicWave(
        new Float32Array(FFT.real),
        new Float32Array(FFT.imag)
    );
    P.changeWave(periodicWave);
}
