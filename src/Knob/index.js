import { h, Component} from 'preact';
import helpers from '../helpers.js';

export default class Knob extends Component {
    componentDidMount() {
        const handleMove = (ev) => {
            let step = this.props.step || 0.5;
            let newVal = this.props.val - (ev.movementY * step);
            if (typeof(this.props.minVal) === 'number' && (newVal < this.props.minVal)) {
                newVal = this.props.minVal;
            } else if (typeof(this.props.maxVal) === 'number' && (newVal > this.props.maxVal)) {
                newVal = this.props.maxVal;
            }
            this.props.update(newVal);
        }
        this.knobRef.addEventListener('dblclick', (ev) => {
            console.log('double');
            this.knobRef.setAttribute('contenteditable', true);
        });
        this.knobRef.addEventListener('mousedown', (ev) => {
            ev.preventDefault();
            document.addEventListener('mousemove', handleMove);
            helpers.oneTime(document, 'mouseup', (ev) => {
                document.removeEventListener('mousemove', handleMove);
            });
        });
    }
    render() {
        return (
            <div ref={(knob) => {this.knobRef = knob}}>{this.props.val}</div>
        )
    }
}

