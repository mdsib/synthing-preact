import { h, Component } from 'preact';
import WaveEditor from '../WaveEditor/';
import WaveManager from '../WaveManager/';
import Synth from '../Synth/';
import CircleButton from '../CircleButton/';
import WaveTable from '../WaveTable/';
import HSlider from '../HSlider/';
import Param from '../Param/';
import Wheel from '../Wheel/';
import './App.css';
import '../iconfont/style.css';
import consts from '../consts.js';
import helpers from '../helpers.js';
import { Provider, connect } from 'preact-redux';

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
            playing: false,
            tones: [{
                active: true,
                waveform: initialWave.slice(),
                mix: 0.7,
                mute: false,
                solo: false,
                beats: boolArray.update(boolArray.create(initBeats), 0, true)
            }],
            numBeats: initBeats,
            editingToneIdx: 0,
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

    editingWaveform = () => this.state.tones[this.state.editingToneIdx].waveform

    activeTones = () => {
        let hasSolo = false;
        const waves = this.state.tones.reduce((accum, val) => {
            let group = 'rest';
            if (val.solo) {
                hasSolo = true;
                group = 'solo';
            }
            if (!this.state.playing || val.beats[this.state.beat]) {
                if (!val.mute) {
                    accum[group].push(val);
                }
            }
            return accum;
        }, {solo: [], rest: []});
        return hasSolo ? waves.solo : waves.rest;
    }

    totalWaveform = () => {
        const tones = this.activeTones();
        if (tones.length === 0) {
            return new Array(consts.BUF_SIZE).fill(0);
        }
        const runningAverage = (curVal, valToAdd, iteration) =>
              (((curVal * iteration) + valToAdd) / (iteration + 1));
        const firstTone = tones.shift();
        return tones.reduce(
            (totalWaveform, currTone, i) => (
                totalWaveform.map(
                    (val, j) => (
                        runningAverage(
                            val,
                            currTone.waveform[j] * currTone.mix,
                            i + 1
                        )
                    )
                )

            ),
            helpers.scale(firstTone.waveform, firstTone.mix)
        );
    }

    updateTone = (idx = this.state.editingToneIdx, opts) => {
        this.setState({
            tones: immObjArray.update(this.state.tones, idx, opts)
        });
    }

    removeTone = (idx) => {
        const tones = immObjArray.remove(this.state.tones, idx);
        this.setState({
            tones,
            editingToneIdx: Math.min(
                this.state.editingToneIdx,
                tones.length - 1
            )
        });
    }

    changeEditingTone = (i) => this.setState({editingToneIdx: i})

    addTone = (
        waveform = initialWave.slice(),
        at = this.state.tones.length,
        isEditing = false
    ) => {
        const tones = immObjArray.add(this.state.tones, at, {
            waveform,
            beats: boolArray.create(this.state.numBeats),
            mix: 0.7,
            mute: false,
            solo: false
        });

        const state = {
            tones
        };

        if (isEditing) {
            state.editingToneIdx = at;
        }

        this.setState(state);
    }

    setBeats = (newNumBeats) => {
        newNumBeats = Math.max(newNumBeats, 1);
        this.setState({
            numBeats: newNumBeats,
            tones: this.state.tones.map((val, idx) => {
                let ret = Object.assign({}, val, {
                    beats: boolArray.setLength(val.beats, newNumBeats)
                });
                return ret;
            })
        })
    }

    metro = () => {
        this.setState({
            playing: true
        });
        const loop = () => {
            if (this.state.playing) {
                this.setState({
                    beat: (this.state.beat + 1) % this.state.numBeats
                })
                window.setTimeout(loop, (1 / this.state.bpm) * 60000);
            }
        }
        loop();
    }

    stopMetro = () => {
        this.setState({
            playing: false,
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
        const tones = this.state.tones.map((form, idx) => {
            return (
                <WaveManager
                    activate={this.changeEditingTone.bind(this, idx)}
                    remove={this.removeTone.bind(this, idx)}
                    duplicate={() => {
                            let pleaseActivate = false;
                            if (this.state.editingToneIdx === idx) {
                                pleaseActivate = true;
                            }
                            this.addTone(this.state.tones[idx].waveform.slice(), idx + 1, pleaseActivate);
                    }}
                    activated={idx === this.state.editingToneIdx}
                    tone={this.state.tones[idx]}
                    beat={this.state.beat}
                    toggleMute={() => {
                            this.updateTone(idx, {
                                mute: !this.state.tones[idx].mute
                            })
                    }}
                    toggleSolo={() => {
                            this.updateTone(idx, {
                                solo: !this.state.tones[idx].solo
                            })
                    }}
                    updateBeat={(i, val) => {
                            this.updateTone(idx, {
                                beats: boolArray.update(
                                    this.state.tones[idx].beats,
                                    i,
                                    val
                                )
                            });
                    }}
                    mix={this.state.tones[idx].mix}
                    updateMix={(mix) => {
                            this.updateTone(idx, {
                                mix
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
                <div>
                    <h1>synthing
                    </h1>
                </div>
                <WaveEditor
                    mouseData={this.state.mouseData}
                    waveform={this.editingWaveform()}
                    updateWaveform={(waveform) => {
                            this.updateTone(this.state.editingToneIdx, {waveform});
                    }}
                ></WaveEditor>
                <div class="global-controls">
                    <CircleButton
                        active={this.state.playing}
                        action={this.metro}
                        disabled={this.state.playing}
                    >
                        <div class="triangle"></div>
                    </CircleButton>
                    <CircleButton
                        active={!this.state.playing}
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
                    <HSlider value={this.props.volume} update={this.props.setVol} />
                </div>
                <div class="wave-manager-container">
                {tones}
                </div>
                <button onClick={() => this.addTone()}>+</button>
                <Synth
                    waveform={this.totalWaveform()}
                    volume={this.props.volume}
                    adsr={this.state.adsr}
                ></Synth>
            </div>
        );
    }
}

export default App;
