import { h, Component} from 'preact';
import helpers from '../helpers';
import consts from '../consts';
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
        });
    });
}, 20)

export default class WaveTable extends Component {
    componentWillUpdate() {
        return false;
    }
    componentDidMount() {
        drawArea(this.props.waveform, this.canvasRef);
        if (this.props.setCanvasRef) {
            this.props.setCanvasRef(this.canvasRef);
        }
    }
    componentWillReceiveProps(newProps) {
        if (newProps.waveform !== this.props.waveform) {
            drawArea(newProps.waveform, this.canvasRef);
        }
    }
    render() {
        const height = this.props.height || 400;
        const width = this.props.width || window.innerWidth - 100;
        return (
            <canvas
                class="wave-table"
                style={`color: red; height: ${height}px; width: ${width}px`}
                height={height}
                width={width}
                ref={(canvas) => {this.canvasRef = canvas}}>
            </canvas>
        );
    }
}
