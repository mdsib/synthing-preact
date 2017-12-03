import { h, Component } from 'preact';
import WaveEditor from '../WaveEditor/';
import Synth from '../Synth/';
import './App.css';
import consts from '../consts.js';
import helpers from '../helpers.js';

class App extends Component {
    constructor() {
        super();
        this.state = {
            waveform: new Array(consts.BUF_SIZE).fill(0.5),
            mouseData: {
                down: false,
                pos: {x: 0, y: 0}
            }
        }
    }
    updateWaveform = (waveform) => {
        if (!waveform) {
            waveform = new Array(consts.BUF_SIZE).fill(0.0);
        }
        this.setState({
            waveform
        });
    }
    handleMouseMove = (ev) => {
        this.setState({
            mouseData: Object.assign({}, this.state.mouseData, {
                x: ev.x,
                y: ev.y,
            })
        });
    }
    handleMouseDown = (ev) => {
        this.setState({
            mouseData: Object.assign({}, this.state.mouseData, {
                down: true,
                downTarget: ev.target
            })
        });
    }
    handleMouseUp = (ev) => {
        this.setState({
            mouseData: Object.assign({}, this.state.mouseData, {
                down: false,
                downTarget: null
            })
        });
    };
    render() {
        return (
            <div
              className="App"
              onMouseDown={this.handleMouseDown}
              onMouseMove={this.handleMouseMove}
              onMouseUp={this.handleMouseUp}
            >
            <button onClick={() => this.updateWaveform()}>click to update</button>
            <WaveEditor
              mouseData={this.state.mouseData}
              waveform={this.state.waveform}
              updateWaveform={this.updateWaveform}
            ></WaveEditor>
            <Synth waveform={this.state.waveform}></Synth>
            </div>
        );
    }
}

export default App;
