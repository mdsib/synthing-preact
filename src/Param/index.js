import { h, Component} from 'preact';
import helpers from '../helpers.js';
import './style.css';

export default class Param extends Component {
    componentDidMount() {
        const setUpMove = () => {
            this.internalVal = this.props.val;
        }
        const handleMove = (ev) => {
            // calculate how much to adjust the value given the
            // min and max values of the param, the speed of the mouse movement,
            // and the precision of the param.
            const maxMov = 300 / (this.props.precision ? this.props.precision + 1 : 1);
            const ratioMov = ev.movementY / maxMov;
            const expRatioMov = -Math.sign(ratioMov) * Math.pow(Math.abs(ratioMov), 1.3);
            const newVal = (expRatioMov * (this.props.maxVal - this.props.minVal)) + this.internalVal;
            this.internalVal = helpers.bounded(
                newVal,
                this.props.minVal,
                this.props.maxVal
            );
            this.props.update(Number(this.internalVal.toFixed(this.props.precision)));
        }
        helpers.clickNDrag(this.paramRef, setUpMove, handleMove, null);
    }
    handleChange(e) {
        this.props.update(e.target.value);
    }
    getNumString() {
        return (this.props.precision !== undefined && this.props.val.toFixed
              ? this.props.val.toFixed(this.props.precision)
              : this.props.val)
             + (this.props.suffix || '');
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
