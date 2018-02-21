import { h, Component } from 'preact';
import WaveTable from '../WaveTable/';
import consts from '../consts.js';
import helpers from '../helpers.js';
import './style.css';

const smoothZoneRange = function (waveData, begin, end) {
    if (begin > end) {
        let tmp = begin;
        begin = end;
        end = tmp;
    }
    const slope = (waveData[end] - waveData[begin]) / (end - begin);
    for (let i = begin + 1; i < end; i++) {
        waveData[i] = helpers.linear(slope, i - begin, waveData[begin]);
    }
    return true;
}

export default class waveEditor extends Component {
    componentDidMount() {
        const handleMove = (ev) => {
            this.updateWaveform({
                x: ev.x + window.scrollX,
                y: ev.y + window.scrollY
            }, this.props.waveform);
        }
        this.divRef.addEventListener('mousedown', (ev) => {
            document.addEventListener('mousemove', handleMove);
            helpers.oneTime(document, 'mouseup', (ev) => {
                handleMove(ev);
                document.removeEventListener('mousemove', handleMove);
                this.setState({
                    prevZone: null
                });
            });
        });
    }
    componentWillUpdate() {
        return false;
    }
    updateWaveform(mouseData, waveform) {
        const waveCanvas = this.divRef;
        const canvasCoords = {
            x: mouseData.x - waveCanvas.offsetLeft,
            y: mouseData.y - waveCanvas.offsetTop,
        };
        const newWaveform = waveform.slice();

        let zone = helpers.bounded(
            Math.floor(consts.BUF_SIZE * canvasCoords.x / waveCanvas.clientWidth),
            0,
            consts.BUF_SIZE - 1
        );

        let val = helpers.bounded(
            ((waveCanvas.clientHeight / 2) - canvasCoords.y) / (waveCanvas.clientHeight / 2),
            -1,
            1
        );

        newWaveform[zone] = val;
        if (this.state.prevZone !== null &&
            Math.abs(this.state.prevZone - zone) > 1) {
            smoothZoneRange(newWaveform, this.state.prevZone, zone)
        }

        this.setState({
            prevZone: zone
        });
        this.props.updateWaveform(newWaveform);
        
    }
    render() {
        return (
            <div
                class="wave-editor"
                ref={(div) => {this.divRef = div}}
            >
                <WaveTable waveform={this.props.waveform} />
            </div>
        );
    }
}
