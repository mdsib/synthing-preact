import { h, Component } from 'preact';
import helpers from '../helpers';
import consts from '../consts';
import UpdateOnResize from '../UpdateOnResize/';
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
        this.myDrawArea = helpers.throttle(() => {
            drawArea(this.props.waveform, this.canvasRef);
        }, 20, true);
    }

    componentDidMount() {
        this.myDrawArea(this.props.waveform, this.canvasRef);
        if (this.props.setCanvasRef) {
            this.props.setCanvasRef(this.canvasRef);
        }
    }

    componentDidUpdate() {
        this.myDrawArea();
    }

    render() {
        const height = this.props.height || 400;
        const width = this.props.width || document.getElementsByTagName('body')[0].clientWidth;
        const pixelHeight = height * window.devicePixelRatio;
        const pixelWidth = width * window.devicePixelRatio;
        return (
            <UpdateOnResize action={this.forceUpdate.bind(this)}>
                <canvas
                    class="wave-table"
                    style={`${this.props.myStyle}; height: ${height}px; width: ${width}px;`}
                    height={pixelHeight}
                    width={pixelWidth}
                    ref={(canvas) => {this.canvasRef = canvas}}>
                </canvas>
            </UpdateOnResize>
        );
    }
}
