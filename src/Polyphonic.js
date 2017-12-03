import DSP from 'dsp.js';
import consts from './consts.js';
const FFT = new DSP.FFT(consts.BUF_SIZE);

export default class Polyphonic {
    constructor(audioContext) {
        this.voices = [];
        this.audioContext = audioContext;
    }
    addVoice(note) {
        let osc = this.audioContext.createOscillator();
        let gain = this.audioContext.createGain();
        gain.gain.value = 0.5;
        osc.connect(gain);
        osc.frequency.value = note.frequency;
        if (this.wave) {
            osc.setPeriodicWave(this.wave);
        }
        gain.connect(this.audioContext.destination);
        osc.start();
        this.voices.push({
            note,
            osc,
            gain
        });
    }
    removeVoice(note) {
        for (var i=0; i< this.voices.length; i++) {
            if (this.voices[i].note.frequency === note.frequency) {
                this.voices[i].osc.stop();
                return this.voices.splice(i, 1);
            }
        }
    }
    changeWave(waveform) {
        FFT.forward(waveform);
        const periodicWave = this.ac.createPeriodicWave(new Float32Array(FFT.real),
                                                        new Float32Array(FFT.imag));
        for (let voice of this.voices) {
            voice.osc.setPeriodicWave(periodicWave);
        }
    }
}
