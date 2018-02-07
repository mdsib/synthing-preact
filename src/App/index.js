import { h, Component } from 'preact';
import WaveEditor from '../WaveEditor/';
import WaveManager from '../WaveManager/';
import Synth from '../Synth/';
import CircleButton from '../CircleButton/';
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

class Knob extends Component {
    componentDidMount() {
        const handleMove = (ev) => {
            let step = this.props.step || 0.5;
            let newVal = this.props.val - (ev.movementY * step);
            if (typeof(this.props.minVal) === 'number' && (newVal < this.props.minVal)) {
                newVal = this.props.minVal;
            } else if (typeof(this.props.maxVal) === 'number' && (newVal > this.props.maxVal)) {
                newVal = this.props.maxVal;
            }
            this.props.update(newVal);
        }
        this.knobRef.addEventListener('mousedown', (ev) => {
            ev.preventDefault();
            document.addEventListener('mousemove', handleMove);
            helpers.oneTime(document, 'mouseup', (ev) => {
                document.removeEventListener('mousemove', handleMove);
            });
        })
    }
    render() {
        return (
            <div ref={(knob) => {this.knobRef = knob}}>{this.props.val}</div>
        )
    }
}


const Adsr = (props) => (
    <div>
    {['a', 'd', 's', 'r'].map((letter) => (
        <Knob
          val={props.adsr[letter]}
          minVal={0}
          maxVal={3}
          step={0.1}
          update={(newVal) => {props.update(letter, newVal)}}
        />
    ))}
    </div>
)


class App extends Component {
    constructor() {
        super();
        let initBeats = 4;
        this.state = {
            metroMs: 250,
            beat: 0,
            waveforms: [{
                waveform: initialWave.slice(),
                beats: boolArray.create(initBeats)
            }],
            numBeats: initBeats,
            editingWaveformIdx: 0,
            adsr: {
                a: 0.3,
                d: 1,
                s: 0.4,
                r: 1
            }
        }
    }

    updateAdsr = (letter, val) => {
        this.setState({
            adsr: Object.assign({}, this.state.adsr, {[letter]: val})
        });
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
        const loop = () => {
            this.setState({
                beat: (this.state.beat + 1) % this.state.numBeats
            })
        }
        const interval = window.setInterval(loop, this.state.metroMs);
        this.setState({
            interval
        })
    }

    stopMetro = () => {
        if (this.state.interval) {
            window.clearInterval(this.state.interval);
        }
        this.setState({
            interval: null,
            beat: 0
        })
    }

    keyHandler(e) {
        //TODO handle global commands, maybe some modal stuff even wow
        console.log('wow i got through', e.key);
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
                      <button onClick={() => {this.setBeats(this.state.numBeats + 1)}}>+ beat</button>
                      <button onClick={() => {this.setBeats(this.state.numBeats - 1)}}>- beat</button>
                      <Adsr adsr={this.state.adsr} update={this.updateAdsr} />
                  </div>
                  {waves}
                  <button onClick={() => this.addWaveform()}>+</button>
                  <Synth waveforms={this.activeWaveforms()} adsr={this.state.adsr}></Synth>
          </div>
        );
    }
}

export default App;
