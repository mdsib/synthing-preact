import { h, Component } from 'preact';
import consts from '../consts.js';
import helpers from '../helpers.js';

const drawArea = (amplitudes, canvas, begin = 0, end = undefined) => {
    const ctx = canvas.getContext("2d");
    const rectWidth = canvas.width / consts.BUF_SIZE;
    const roundedWidth = Math.max(1, rectWidth)
    const lineWidth = 5;
    const halfCanvas = (canvas.height - lineWidth) / 2;
    window.requestAnimationFrame(() => {
        amplitudes.forEach((amp, idx) => {
            amp *= halfCanvas;
            const roundedXOffset = Math.round(idx * rectWidth);
            ctx.clearRect(roundedXOffset, 0, roundedWidth + 1, canvas.height);
            ctx.fillStyle  = "#ddd";
            ctx.fillRect(roundedXOffset, halfCanvas, roundedWidth + 1, -amp);
            ctx.fillStyle  = "#e44";
            ctx.fillRect(roundedXOffset, -amp + halfCanvas, roundedWidth + 1, lineWidth);
        });
    });
}

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
            Math.floor(consts.BUF_SIZE * canvasCoords.x / waveCanvas.width) - 1,
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
        const drawing = newProps.mouseData.down &&
                        newProps.mouseData.downTarget === this.canvasRef;

        if (newProps.waveform !== this.props.waveform) {
            drawArea(newProps.waveform, this.canvasRef);
        }
        else if (drawing) {
            this.updateWaveform(newProps.mouseData, newProps.waveform);
        }
        if (!drawing) {
            this.setState({
                prevZone: null
            })
        }
    }
    render() {
        return (
            <canvas
              height={400}
              width={800}
              ref={(canvas) => this.canvasRef = canvas}>
            </canvas>
        );
    }
}
