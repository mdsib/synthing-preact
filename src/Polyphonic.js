import consts from './consts.js';
import Envelope from 'envelope-generator';

export default class Polyphonic {
    constructor(audioContext) {
        const masterVol = audioContext.createGain();
        masterVol.gain.value = 0.7;
        masterVol.connect(audioContext.destination);
        this.voices = {};
        this.audioContext = audioContext;
        this.periodicWave = null;
        this.masterVolume = masterVol;
    }
    setVolume(newVol) {
        this.masterVolume.gain.value = newVol;
    }
    addVoice(note, adsr) {
        this.voices[note.note] = this.voices[note.note] || [];

        let osc = this.audioContext.createOscillator();
        let gain = this.audioContext.createGain();
        let envelope = new Envelope(this.audioContext, {
            attackTime: adsr.attack,
            decayTime: adsr.decay,
            sustainLevel: adsr.sustain,
            releaseTime: adsr.release,
            maxLevel: 0.4
        });

        osc.frequency.value = note.frequency;
        gain.gain.setValueAtTime(0, 0)
        if (this.periodicWave) {
            osc.setPeriodicWave(this.periodicWave);
        }

        envelope.connect(gain.gain);
        osc.connect(gain);
        gain.connect(this.masterVolume);

        osc.start();
        envelope.start(this.audioContext.currentTime - 0.1);

        this.voices[note.note].push({
            note,
            osc,
            gain,
            envelope
        });
    }
    removeVoice(note) {
        const voiceList = this.voices[note.note];
        const voice = voiceList[voiceList.length - 1];
        voice.envelope.release(this.audioContext.currentTime);
        voice.osc.stop(voice.envelope.getReleaseCompleteTime());
        setTimeout(() => {
            voice.gain.disconnect();
            voiceList.splice(voiceList.indexOf(voice), 1);
        }, 1000 * (voice.envelope.getReleaseCompleteTime() - this.audioContext.currentTime));
    }
    changeWave(waveform) {
        if (waveform !== this.periodicWave) {
            this.periodicWave = waveform;
            for (let noteVoices in this.voices) {
                for (let voice of this.voices[noteVoices]) {
                    voice.osc.setPeriodicWave(this.periodicWave);
                }
            }
        }
    }
}
