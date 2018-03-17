import { h, Component } from 'preact';
import helpers from '../helpers';
import consts from '../consts';
import './style.css';

const drawArea = helpers.soon((amplitudes, canvas, begin = 0, end = undefined) => {
    const ctx = canvas.getContext("2d");
    const rectWidth = canvas.width / consts.BUF_SIZE;
    const roundedWidth = Math.max(1, rectWidth)
    const lineWidth = 1;
    const halfCanvas = (canvas.height - lineWidth) / 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    amplitudes.forEach((amp, idx) => {
        amp *= halfCanvas;
        const roundedXOffset = Math.round(idx * rectWidth);
        ctx.rect(roundedXOffset, halfCanvas, roundedWidth + 1, -amp);
    });
    ctx.fillStyle  = "#ff735e";
    ctx.fill();
    ctx.closePath();
});

export default class WaveTable extends Component {
    constructor() {
        super();
        this.drawArea = helpers.throttle(drawArea, 20);
    }
    componentWillUpdate() {
        return this.props.resize;
    }
    componentDidMount() {
        this.drawArea(this.props.waveform, this.canvasRef);
        if (this.props.setCanvasRef) {
            this.props.setCanvasRef(this.canvasRef);
        }
        if (this.props.resize) {
            window.addEventListener('resize', (ev) => {
                drawArea(this.props.waveform, this.canvasRef);
                this.forceUpdate();
            });
        }
    }
    componentWillReceiveProps(newProps) {
        this.drawArea(newProps.waveform, this.canvasRef);
    }
    render() {
        const height = this.props.height || 400;
        const width = this.props.width || window.innerWidth - 100;
        const pixelHeight = height * window.devicePixelRatio;
        const pixelWidth = width * window.devicePixelRatio;
        return (
            <canvas
                class="wave-table"
                style={`${this.props.myStyle}; color: red; height: ${height}px; width: ${width}px`}
                height={pixelHeight}
                width={pixelWidth}
                ref={(canvas) => {this.canvasRef = canvas}}>
            </canvas>
        );
    }
}
