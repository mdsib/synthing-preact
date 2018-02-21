import { h, Component } from 'preact';
import WaveEditor from '../WaveEditor/';
import WaveManager from '../WaveManager/';
import Synth from '../Synth/';
import CircleButton from '../CircleButton/';
import Param from '../Param/';
import Wheel from '../Wheel/';
import './App.css';
import consts from '../consts.js';
import helpers from '../helpers.js';

const initialWave = new Array(consts.BUF_SIZE)
    .fill(0)
    .map((val, i) => Math.sin(i / consts.BUF_SIZE * Math.PI * 2));

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

const adsrProperties = [
    {
        name: 'attack',
        suffix: 's',
        maxVal: 10
    },
    {
        name: 'decay',
        suffix: 's',
        maxVal: 10
    },
    {
        name: 'sustain',
        maxVal: 2
    },
    {
        name: 'release',
        suffix: 's',
        maxVal: 30,
    }
];


const Adsr = (props) => (
    <div style="display: inline-block;">
        {adsrProperties.map((aspect) => (
            <Param
                suffix={aspect.suffix || ''}
                precision={1}
                val={props.adsr[aspect.name]}
                name={aspect.name}
                minVal={0}
                maxVal={aspect.maxVal}
                step={0.1}
                update={(newVal) => {props.update(aspect.name, newVal)}}
                >
                <Wheel percent={props.adsr[aspect.name] / aspect.maxVal} />
            </Param>
        ))}
    </div>
)


class App extends Component {
    constructor() {
        super();
        let initBeats = 4;
        this.state = {
            bpm: 120,
            beat: 0,
            waveforms: [{
                active: true,
                waveform: initialWave.slice(),
                beats: boolArray.update(boolArray.create(initBeats), 0, true)
            }],
            numBeats: initBeats,
            editingWaveformIdx: 0,
            adsr: {
                attack: 0.3,
                decay: 1,
                sustain: 0.4,
                release: 1
            }
        }
    }

    updateAdsr = (aspect, val) => {
        this.setState({
            adsr: Object.assign({}, this.state.adsr, {[aspect]: val})
        });
    }

    editingWaveform = () => this.state.waveforms[this.state.editingWaveformIdx].waveform

    activeWaveforms = () => this.state.waveforms.reduce((accum, val) => {
        if (val.beats[this.state.beat]) {
            accum.push(val.waveform);
        }
        return accum;
    }, [])

    totalWaveform = () => {
        const allWaves = this.activeWaveforms();
        if (allWaves.length === 0) {
            return new Array(consts.BUF_SIZE).fill(0);
        }
        const firstWave = allWaves.shift();
        return allWaves.reduce(
            (totalArray, currWaveform, i) => totalArray.map((val, j) => ((val * (i + 1)) + currWaveform[j]) / (i + 2)),
            firstWave
        )
    }

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

    addWaveform = (waveform = initialWave.slice(), at = this.state.waveforms.length, isEditing = false) => {
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
            interval: true
        });
        const loop = () => {
            if (this.state.interval) {
                this.setState({
                    beat: (this.state.beat + 1) % this.state.numBeats
                })
                window.setTimeout(loop, (1 / this.state.bpm) * 60000);
            }
        }
        loop();
    }

    stopMetro = () => {
        if (this.state.interval) {
            window.clearInterval(this.state.interval);
        }
        this.setState({
            interval: false,
            beat: 0
        })
    }

    keyHandler(e) {
        //TODO handle global commands, maybe some modal stuff even wow
        console.log('wow i got through', e.key);
    }

    setBpm = (newBpm) => {
        this.setState({
            bpm: newBpm
        });
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
                    waveformData={this.state.waveforms[idx]}
                    beat={this.state.beat}
                    toggleMute={() => {
                            this.updateWaveform(idx, {
                                mute: !this.state.waveforms[idx].mute
                            })
                    }}
                    toggleSolo={() => {
                            this.updateWaveform(idx, {
                                solo: !this.state.waveforms[idx].solo
                            })
                    }}
                    updateBeat={(i, val) => {
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
                onKeyDown={this.keyHandler}
            >
                <h1>synthing</h1>
                <WaveEditor
                    mouseData={this.state.mouseData}
                    waveform={this.editingWaveform()}
                    updateWaveform={(waveform) => {
                            this.updateWaveform(this.state.editingWaveformIdx, {waveform});
                    }}
                ></WaveEditor>
                <div class="global-controls">
                    <CircleButton
                        active={this.state.interval}
                        action={this.metro}
                        disabled={this.state.interval}
                    >
                        <div class="triangle"></div>
                    </CircleButton>
                    <CircleButton
                        active={!this.state.interval}
                        action={this.stopMetro}
                    >
                        <div class="rectangle"></div>
                    </CircleButton>
                    <Param
                        precision={0}
                        name="bpm"
                        minVal={20}
                        maxVal={600}
                        step={1}
                        val={this.state.bpm}
                        update={this.setBpm}
                    />
                    <Param
                        name="beats"
                        minVal="1"
                        maxVal={16}
                        step="1"
                        val={this.state.numBeats}
                        update={this.setBeats}
                    />
                    <Adsr adsr={this.state.adsr} update={this.updateAdsr} />
                </div>
                {waves}
                <button onClick={() => this.addWaveform()}>+</button>
                <Synth waveform={this.totalWaveform()} adsr={this.state.adsr}></Synth>
            </div>
        );
    }
}

export default App;
