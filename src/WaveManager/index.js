import { h, Component } from 'preact';
import CheckBox from '../CheckBox/';
import WaveTable from '../WaveTable/';
import helpers from '../helpers';
import './style.css';

export default class WaveManager extends Component {
    render() {
        const modeClass = this.props.activated ? ' selected' : '';
        return (
            <div class={`wave-manager${modeClass}`}>
                <div class="buttons">
                    <div class="left-button-group">
                        <div>
                            <button
                                class="item"
                                onClick={this.props.remove}
                            >
                                <span class="icon-ex"></span>
                            </button>
                            <button
                                class="item"
                                onClick={this.props.duplicate}
                            >
                                <span class="icon-dupe"></span>
                            </button>
                        </div>
                    </div>
                    <div class="right-button-group">
                        <button
                            class={`item solo${this.props.waveformData.solo ? ' active' : ''}`}
                            onClick={this.props.toggleSolo}
                        >
                            solo
                        </button>
                        <button
                            class={`item mute${this.props.waveformData.mute ? ' active' : ''}`}
                            onClick={this.props.toggleMute}
                        >
                            mute
                        </button>
                    </div>
                </div>
                <div class="beats">
                    <div onClick={this.props.activate}>
                        <WaveTable
                            height={40}
                            width={75}
                            waveform={this.props.waveformData.waveform.slice()}
                        />
                    </div>

                    {this.props.waveformData.beats.map((val, idx) => {
                         return (
                             <CheckBox
                                 class={this.props.beat === idx ? 'beat' : ''}
                                 checked={val}
                                 update={helpers.partial(this.props.updateBeat, idx)} />
                         )})}
                </div>
            </div>
        );
    }
}
