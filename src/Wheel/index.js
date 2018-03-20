import { h, Component} from 'preact';
import UpdateOnResize from '../UpdateOnResize/';

const drawCircle = (canvas, percent) => {
    const context = canvas.getContext('2d');
    const color = '#ff735e';

    const width = canvas.width;
    const radius = canvas.width / 2;
    const lineWidth = radius / 3;
    const innerRadius = radius - lineWidth / 2;
    context.lineWidth = lineWidth;
    context.clearRect(0,0, width, width);
    context.beginPath();
    context.strokeStyle = "#00000011";

    if (percent === 0) {
        context.arc(radius, radius, innerRadius, 0, Math.PI);
        context.stroke();
    }
    else {
        const begin = -(Math.PI / 2);
        const end = 2 * Math.PI * percent - Math.PI / 2;

        context.arc(radius, radius, innerRadius, end, begin);
        context.stroke();
        context.beginPath();
        context.strokeStyle = color;
        context.arc(radius, radius, innerRadius, begin, end);
        context.stroke();
    }

}

export default class Wheel extends Component {
    draw = () => {
        drawCircle(this.wheelRef, this.props.percent);
    }

    componentDidMount() {
        this.draw();
    }

    componentDidUpdate() {
        this.draw();
    }

    render() {
        const diameter = 36;
        const scaledDiameter = diameter * window.devicePixelRatio;
        return (
            <UpdateOnResize action={this.forceUpdate.bind(this)}>
                <canvas
                    class="wheel"
                    height={scaledDiameter}
                    width={scaledDiameter}
                    style={`width:${diameter}px; height: ${diameter}px;`}
                    ref={(ref) => {this.wheelRef = ref}}
                ></canvas>
            </UpdateOnResize>
        );
    }
}
