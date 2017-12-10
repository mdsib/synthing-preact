import consts from './consts.js';
import Envelope from 'envelope-generator';

export default class Polyphonic {
    constructor(audioContext) {
        this.audioContext = audioContext;
        this.periodicWave = null;
    }
    addVoice(note, adsr) {
        let osc = this.audioContext.createOscillator();
        let gain = this.audioContext.createGain();
        let envelope = new Envelope(this.audioContext, {
            attackTime: adsr.a,
            decayTime: adsr.d,
            sustainTime: adsr.s,
            releaseTime: adsr.r
        });
        osc.frequency.value = note.frequency;
        gain.gain.setValueAtTime(0, 0)
        if (this.periodicWave) {
            osc.setPeriodicWave(this.periodicWave);
        }

        envelope.connect(gain.gain);
        osc.connect(gain);
        gain.connect(this.audioContext.destination);

        osc.start();
        envelope.start(this.audioContext.currentTime - 0.1);
        this.voices.push({
            note,
            osc,
            gain,
            envelope
        });
    }
    removeVoice(note) {
        for (var i=0; i < this.voices.length; i++) {
            if (this.voices[i].note.note === note.note) {
                this.voices[i].envelope.release(this.audioContext.currentTime);
                let voice = this.voices[i];
                voice.envelope.stop(this.audioContext.currentTime + 3);
                voice.osc.stop(this.audioContext.currentTime + 3);
            }
        }
    }
    changeWave(waveform) {
        this.periodicWave = waveform;
        for (let voice of this.voices) {
            voice.osc.setPeriodicWave(this.periodicWave);
        }
    }
}
