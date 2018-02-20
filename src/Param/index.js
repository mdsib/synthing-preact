import { h, Component} from 'preact';
import helpers from '../helpers.js';
import './style.css';

export default class Param extends Component {
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
        this.paramRef.addEventListener('mousedown', (ev) => {
            ev.preventDefault();
            document.addEventListener('mousemove', handleMove);
            helpers.oneTime(document, 'mouseup', (ev) => {
                document.removeEventListener('mousemove', handleMove);
            });
        });
    }
    handleChange(e) {
        this.props.update(e.target.value);
    }
    getNumString() {
        return (this.props.precision ?
            this.props.val.toFixed(this.props.precision) :
                this.props.val) + (this.props.suffix || '');
    }
    render() {
        const inputId = `param-${this.props.name}`;
        return (
            <div class="param" ref={(param) => {this.paramRef = param}}>
                <label for={inputId}>{this.props.name}</label>
                <input
                    type="text"
                    id={inputId}
                    value={this.getNumString()}
                    onChange={this.handleChange}
                ></input>
                {this.props.children}
            </div>
        )
    }
}

