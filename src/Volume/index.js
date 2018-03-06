import { h, Component } from 'preact';
import helpers from '../helpers';
import './style.css';

export default class Volume extends Component {
    handleUpdate = (ev) => {
        const minVolX = this.sliderRef.offsetLeft;
        const maxVolX = this.sliderRef.offsetLeft + this.sliderRef.offsetWidth;
        this.props.update(helpers.bounded((ev.x - minVolX) / (maxVolX - minVolX), 0, 1));

    }
    componentDidMount() {
        helpers.clickNDrag(this.sliderRef, this.handleUpdate, this.handleUpdate, null);
    }
    render() {
        return (
            <div class="Volume" ref={(ref) => {this.volRef = ref}}>
                <span class="icon-volume"></span>
                <div
                    class="volume-triangle-container"
                    ref={(ref) => {this.sliderRef = ref}}
                >
                    <div
                        class="volume-triangle -foreground"
                        style={`transform: scale(${this.props.volume});`}
                    ></div>
                    <div class="volume-triangle -background"></div>
                </div>
            </div>
        );

    }
}
