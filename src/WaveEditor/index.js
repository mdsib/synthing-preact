import { h, Component } from 'preact';
import consts from '../consts.js';
import helpers from '../helpers.js';
import './style.css';

const drawArea = helpers.throttle((amplitudes, canvas, begin = 0, end = undefined) => {
    const ctx = canvas.getContext("2d");
    const rectWidth = canvas.width / consts.BUF_SIZE;
    const roundedWidth = Math.max(1, rectWidth)
    const lineWidth = 1;
    const halfCanvas = (canvas.height - lineWidth) / 2;
    window.requestAnimationFrame(() => {
        amplitudes.forEach((amp, idx) => {
            amp *= halfCanvas;
            const roundedXOffset = Math.round(idx * rectWidth);
            ctx.clearRect(roundedXOffset, 0, roundedWidth + 1, canvas.height);
            ctx.fillStyle  = "#ff735e";
            ctx.fillRect(roundedXOffset, halfCanvas, roundedWidth + 1, -amp);
            //ctx.fillStyle  = "rgba(255, 115, 94, 0.1)"; // changing color for the border
            //ctx.fillRect(roundedXOffset, -amp + halfCanvas, roundedWidth + 1, lineWidth);
        });
    });
}, 20)

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
        drawArea(this.props.waveform, this.canvasRef);
        const handleMove = (ev) => {
            this.updateWaveform({
                x: ev.x + window.scrollX,
                y: ev.y + window.scrollY
            }, this.props.waveform);
        }
        this.canvasRef.addEventListener('mousedown', (ev) => {
            document.addEventListener('mousemove', handleMove);
            helpers.oneTime(document, 'mouseup', (ev) => {
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
        const waveCanvas = this.canvasRef;
        const canvasCoords = {
            x: mouseData.x - waveCanvas.offsetLeft,
            y: mouseData.y - waveCanvas.offsetTop,
        };
        const newWaveform = waveform.slice();

        let zone = helpers.bounded(
            Math.floor(consts.BUF_SIZE * canvasCoords.x / waveCanvas.width),
            0,
            consts.BUF_SIZE - 1
        );

        let val = helpers.bounded(
            ((waveCanvas.height / 2) - canvasCoords.y) / (waveCanvas.height / 2),
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
    componentWillReceiveProps(newProps) {
        if (newProps.waveform !== this.props.waveform) {
            drawArea(newProps.waveform, this.canvasRef);
        }
    }
    render() {
        return (
            <canvas
                class="waveEditor"
                height={400}
                width={window.innerWidth - 100}
                ref={(canvas) => {this.canvasRef = canvas}}>
            </canvas>
        );
    }
}
