import { h, Component } from 'preact';
import helpers from '../helpers';
import './style.css';

const mapVol = (vol) => vol * vol;
const unmapVol = (vol) => Math.sqrt(vol);

export default class Volume extends Component {
    handleUpdate = (ev) => {
        const minVolX = this.sliderRef.offsetLeft;
        const maxVolX = this.sliderRef.offsetLeft + this.sliderRef.offsetWidth;
        const width = maxVolX - minVolX;
        const offset = helpers.bounded(ev.x - minVolX, 0, width);
        this.props.update(mapVol(offset / width));

    }
    componentDidMount() {
        helpers.clickNDrag(this.sliderRef, this.handleUpdate, this.handleUpdate, null);
    }
    render() {
        return (
            <div class={`Volume${this.props.class ? ' ' + this.props.class : ''}`} ref={(ref) => {this.volRef = ref}}>
                {this.props.children.length
                 ? this.props.children
                 : (<span class="icon-volume"></span>)
                }
                <div
                    class="volume-triangle-container"
                    ref={(ref) => {this.sliderRef = ref}}
                >
                    <div
                        class="volume-triangle -foreground"
                        style={`transform: scale(${unmapVol(this.props.volume)});`}
                    ></div>
                    <div class="volume-triangle -background"></div>
                </div>
            </div>
        );

    }
}
