import { h, Component} from 'preact';
import helpers from '../helpers';
import consts from '../consts';
import './style.css';

const drawArea = helpers.soon((amplitudes, canvas, begin = 0, end = undefined) => {
    const ctx = canvas.getContext("2d");
    const rectWidth = canvas.width / consts.BUF_SIZE;
    const roundedWidth = Math.max(1, rectWidth)
    const lineWidth = 1;
    const halfCanvas = (canvas.height - lineWidth) / 2;
    amplitudes.forEach((amp, idx) => {
        amp *= halfCanvas;
        const roundedXOffset = Math.round(idx * rectWidth);
        ctx.clearRect(roundedXOffset, 0, roundedWidth + 1, canvas.height);
        ctx.fillStyle  = "#ff735e";
        ctx.fillRect(roundedXOffset, halfCanvas, roundedWidth + 1, -amp);
    });
});

export default class WaveTable extends Component {
    constructor() {
        super();
        this.drawArea = helpers.throttle(drawArea, 30);
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
                console.log('yo', this.forceUpdate)
                this.forceUpdate();
            })
        }
    }
    componentWillReceiveProps(newProps) {
        this.drawArea(newProps.waveform, this.canvasRef);
    }
    render() {
        const height = this.props.height || 400;
        const width = this.props.width || window.innerWidth - 120;
        return (
            <canvas
                class="wave-table"
                style={`${this.props.myStyle}; color: red; height: ${height}px; width: ${width}px`}
                height={height}
                width={width}
                ref={(canvas) => {this.canvasRef = canvas}}>
            </canvas>
        );
    }
}
