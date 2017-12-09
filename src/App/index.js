import { h, Component } from 'preact';
import WaveEditor from '../WaveEditor/';
import WaveManager from '../WaveManager/';
import Synth from '../Synth/';
import './App.css';
import consts from '../consts.js';

const initialWave = new Array(consts.BUF_SIZE).fill(0);

const immObjArray = {
    update: (arr, idx, opts) => {
        const newArr = arr.slice();
        newArr[idx] = Object.assign({}, arr[idx], opts)
        return newArr;
    },
    add: (arr, idx, opts) => {
        const newArr = arr.slice();
        newArr.splice(idx, 0, opts);
        return newArr;
    },
    remove: (arr, idx) => {
        const newArr = arr.slice();
        newArr.splice(idx, 1);
        return newArr;
   }
}

const boolArray = {
    setLength: (ba, newLength) => {
        let newBa = ba.slice(0, newLength);
        if (ba.length < newLength) {
            newBa = newBa.concat(new Array(newLength - ba.length).fill(false));
        }
        return newBa;
    }, create: (length) => {
        return new Array(length).fill(false);
    },
    update: (ba, idx, val) => {
        const newBa = ba.slice();
        newBa[idx] = val;
        return newBa;
    }
}



class App extends Component {
    constructor() {
        super();
        let initBeats = 4;
        this.state = {
            metroMs: 250,
            beat: 1,
            waveforms: [{
                waveform: initialWave.slice(),
                beats: boolArray.create(initBeats)
            }],
            numBeats: initBeats,
            editingWaveformIdx: 0,
            mouseData: {
                down: false,
                pos: {x: 0, y: 0}
            },
            adsr: {
                attackTime: 0.1,
                decayTime: 1,
                sustainLevel: 0.4,
                releaseTime: 2
            }
        }
    }

    editingWaveform = () => this.state.waveforms[this.state.editingWaveformIdx].waveform

    activeWaveforms = () => this.state.waveforms.reduce((accum, val) => {
        if (val.beats[this.state.beat]) {
            accum.push(val.waveform);
        }
        return accum;
    }, [])

    updateWaveform = (idx = this.state.editingWaveformIdx, opts) => {
        this.setState({
            waveforms: immObjArray.update(this.state.waveforms, idx, opts)
        });
    }

    removeWaveform = (idx) => {
        const waveforms = immObjArray.remove(this.state.waveforms, idx);
        this.setState({
            waveforms,
            editingWaveformIdx: Math.min(
                this.state.editingWaveformIdx,
                waveforms.length - 1
            )
        });
    }

    changeEditingWaveform = (i) => this.setState({editingWaveformIdx: i})

    addWaveform = (waveform = new Array(consts.BUF_SIZE).fill(0), at = this.state.waveforms.length, isEditing = false) => {
        const waveforms = immObjArray.add(this.state.waveforms, at, {
            waveform,
            beats: boolArray.create(this.state.numBeats)
        });
                       
        const state = {
            waveforms
        };

        if (isEditing) {
            state.editingWaveformIdx = at;
        }
        
        this.setState(state);
    }
    setBeats = (newNumBeats) => {
        newNumBeats = Math.max(newNumBeats, 1);
        this.setState({
            numBeats: newNumBeats,
            waveforms: this.state.waveforms.map((val, idx) => {
                let ret = Object.assign({}, val, {
                    beats: boolArray.setLength(val.beats, newNumBeats)
                });
                return ret;
            })
        })
    }

    metro = () => {
        this.setState({
            beat: (this.state.beat + 1) % this.state.numBeats
        })
        window.setTimeout(this.metro, this.state.metroMs);
    }

    render() {
        const waves = this.state.waveforms.map((form, idx) => {
            return (
              <WaveManager
                activate={this.changeEditingWaveform.bind(this, idx)}
                remove={this.removeWaveform.bind(this, idx)}
                duplicate={() => {
                    let pleaseActivate = false;
                    if (this.state.editingWaveformIdx === idx) {
                        pleaseActivate = true;
                    }
                    this.addWaveform(this.state.waveforms[idx].waveform.slice(), idx + 1, pleaseActivate);
                }}
                activated={idx === this.state.editingWaveformIdx}
                beats={this.state.waveforms[idx].beats}
                beat={this.state.beat}
                updateBeat={(i, val) => {
                    console.log('updating', i, val);
                    this.updateWaveform(idx, {
                        beats: boolArray.update(
                            this.state.waveforms[idx].beats,
                            i,
                            val
                        )
                    });
                }}
              ></WaveManager>
            );
        })
        return (
          <div
            className="App"
          >
            <WaveEditor
              mouseData={this.state.mouseData}
              waveform={this.editingWaveform()}
              updateWaveform={(waveform) => {
                this.updateWaveform(this.state.editingWaveformIdx, {waveform});
              }}
            ></WaveEditor>
            <button onClick={() => {this.setBeats(this.state.numBeats + 1)}}>+ beat</button>
            <button onClick={() => {this.setBeats(this.state.numBeats - 1)}}>- beat</button>
            <button onClick={() => this.addWaveform()}>+</button>
            {waves}
            <Synth waveforms={this.activeWaveforms()} adsr={this.state.adsr}></Synth>
            <button onClick={this.metro}>start</button>
          </div>
        );
    }
}

export default App;
