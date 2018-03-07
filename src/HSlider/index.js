import { h, Component } from 'preact';
import helpers from '../helpers';
import './style.css';

const mapVal = (val) => val * val;
const unmapVal = (val) => Math.sqrt(val);

export default class HSlider extends Component {
    handleUpdate = (ev) => {
        const minValX = this.sliderRef.offsetLeft;
        const maxValX = this.sliderRef.offsetLeft + this.sliderRef.offsetWidth;
        const width = maxValX - minValX;
        const offset = helpers.bounded(ev.x - minValX, 0, width);
        this.props.update(mapVal(offset / width));

    }
    componentDidMount() {
        helpers.clickNDrag(this.sliderRef, this.handleUpdate, this.handleUpdate, null);
    }
    render() {
        return (
            <div class={`HSlider${this.props.class ? ' ' + this.props.class : ''}`} ref={(ref) => {this.volRef = ref}}>
                {this.props.children.length
                 ? this.props.children
                 : (<span class="icon-volume"></span>)
                }
                <div
                    class="hslider-triangle-container"
                    ref={(ref) => {this.sliderRef = ref}}
                >
                    <div
                        class="hslider-triangle -foreground"
                        style={`transform: scale(${unmapVal(this.props.value)});`}
                    ></div>
                    <div class="hslider-triangle -background"></div>
                </div>
            </div>
        );

    }
}
