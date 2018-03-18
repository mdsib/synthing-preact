import { h, Component } from 'preact';
import WaveEditor from '../WaveEditor/';
import WaveManager from '../WaveManager/';
import Synth from '../Synth/';
import CircleButton from '../CircleButton/';
import HSlider from '../HSlider/';
import Param from '../Param/';
import Wheel from '../Wheel/';
import Help from '../Help/';
import Keybindings from '../Keybindings/';
import './App.css';
import '../iconfont/style.css';
import consts from '../consts.js';
import helpers from '../helpers.js';

const Adsr = (props) => (
    <div class="adsr">
        {consts.adsrProperties.map((aspect) => (
            <Param
                suffix={aspect.suffix || ''}
                precision={1}
                val={props.adsr[aspect.name]}
                name={aspect.name}
                minVal={0}
                maxVal={aspect.maxVal}
                update={(newVal) => {props.update(aspect.name, newVal)}}
                >
                <Wheel percent={props.adsr[aspect.name] / aspect.maxVal} />
            </Param>
        ))}
    </div>
)

class App extends Component {
    editingWaveform = () => this.props.tones[this.props.editingToneIdx].waveform

    //TODO these can be in redux too, using reselect
    activeTones = () => {
        let hasSolo = false;
        const waves = this.props.tones.reduce((accum, val) => {
            let group = 'rest';
            if (val.solo) {
                hasSolo = true;
                group = 'solo';
            }
            if (!this.props.playing || val.beats[this.props.beat]) {
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

    keyHandler(e) {
        //TODO handle global commands, maybe some modal stuff even wow
        console.log('wow i got through', e.key);
    }

    render() {
        const tones = this.props.tones.map((form, idx) => {
            return (
                <WaveManager
                    activate={this.props.setEditingToneIdx.bind(null, idx)}
                    remove={this.props.deleteTone.bind(null, idx)}
                    duplicate={() => {
                            let pleaseActivate = false;
                            if (this.props.editingToneIdx === idx) {
                                pleaseActivate = true;
                            }
                            this.props.addTone(this.props.tones[idx].waveform.slice(), idx + 1, pleaseActivate);
                    }}
                    activated={idx === this.props.editingToneIdx}
                    tone={this.props.tones[idx]}
                    beat={this.props.beat}
                    toggleMute={() => {
                            this.props.setToneProperty(idx, 'mute', !this.props.tones[idx].mute);
                    }}
                    toggleSolo={() => {
                            this.props.setToneProperty(idx, 'solo', !this.props.tones[idx].solo);
                    }}
                    updateBeat={(i, val) => {
                            this.props.setToneProperty(
                                idx,
                                'beats',
                                helpers.boolArray.update(
                                    this.props.tones[idx].beats,
                                    i,
                                    val
                                )
                            );
                    }}
                    mix={this.props.tones[idx].mix}
                    updateMix={(mix) => {this.props.setToneProperty(idx, 'mix', mix)}}
                ></WaveManager>
            );
        })
        const Synthing = (
            <div
                class="App"
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
                            this.props.setToneProperty(this.props.editingToneIdx, 'waveform', waveform);
                    }}
                ></WaveEditor>
                <div class="global-controls">
                    <div class="play-container">
                        <CircleButton
                            active={this.props.playing}
                            action={this.props.startMetro}
                            disabled={this.props.playing}
                        >
                            <div class="triangle"></div>
                        </CircleButton>
                        <CircleButton
                            active={!this.props.playing}
                            action={this.props.stopMetro}
                        >
                            <div class="rectangle"></div>
                        </CircleButton>
                        <Param
                            precision={0}
                            name="bpm"
                            minVal={20}
                            maxVal={600}
                            val={this.props.bpm}
                            update={this.props.setBpm}
                        />
                        <Param
                            name="beats"
                            minVal={3}
                            maxVal={16}
                            val={this.props.numBeats}
                            update={this.props.setNumBeats}
                        />
                    </div>
                    <div class="adsr-container">
                        <Adsr adsr={this.props.adsr} update={this.props.setAdsrProperty} />
                        <HSlider value={this.props.volume} update={this.props.setVolume} />
                    </div>
                </div>
                <div class="wave-manager-container">
                    {tones}
                </div>
                <button onClick={() => this.props.addTone()}>+</button>
                <Synth
                    waveform={this.totalWaveform()}
                    volume={this.props.volume}
                    adsr={this.props.adsr}
                ></Synth>
                <Help />
                <Keybindings />
            </div>
        );
        const MobileBlockade = (
            <div>
                <h1>Visit Synthing on your laptop or desktop</h1>
                <h2>Or borrow one from a friend and use it together</h2>
                <h3>Synthing requires a mouse and a hardware keyboard for now</h3>
                <h4>Thanks {":)"}</h4>
            </div>
        );
        // I'm sorry, but I must sniff. It's not about screen size, it's about the hardware.
        return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i
            .test(navigator.userAgent) ? MobileBlockade : Synthing;
    }
};

export default App;
