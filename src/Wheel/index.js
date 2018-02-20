import { h, Component} from 'preact';

const drawCircle = (canvas, percent) => {
    const context = canvas.getContext('2d');
    const color = '#ff735e';

    context.lineWidth = 6;
    context.clearRect(0,0,36,36);
    context.beginPath();
    context.strokeStyle = "#00000011";

    if (percent === 0) {
        context.arc(18, 18, 15, 0, 10);
        context.stroke();
    }
    else {
        const begin = -(Math.PI / 2);
        const end = 2 * Math.PI * percent - Math.PI / 2;

        context.arc(18, 18, 15, end, begin);
        context.stroke();
        context.beginPath();
        context.strokeStyle = color;
        context.arc(18, 18, 15, begin, end);
        context.stroke();
    }

}

export default class Wheel extends Component {
    componentWillUpdate() {
        return false;
    }

    componentDidMount() {
        drawCircle(this.wheelRef, this.props.percent);
    }

    componentWillReceiveProps(newProps) {
        if (newProps.percent !== this.props.percent);
        drawCircle(this.wheelRef, newProps.percent);
    }

    render() {
        return (
            <canvas
                class="wheel"
                height="36"
                width="36"
                ref={(ref) => {this.wheelRef = ref}}
            ></canvas>
        );
    }
}
