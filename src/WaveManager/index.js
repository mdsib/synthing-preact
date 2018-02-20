import { h, Component } from 'preact';
import CheckBox from '../CheckBox/';
import WaveTable from '../WaveTable/';
import helpers from '../helpers';
import './style.css';

export default class WaveManager extends Component {
    render() {
        return (
            <div class="wave-manager">
                <div class="buttons">
                    {this.props.activated ? (
                         <div>
                         <button onClick={this.props.remove}>remove</button>
                         <button onClick={this.props.duplicate}>dupe</button>
                         </div>
                    ) : ''}
                </div>
                <div class="beats">
                    <div onClick={this.props.activate}>
                        <WaveTable
                            height={40}
                            width={75}
                            waveform={this.props.waveform.slice()}
                        />
                    </div>

                    {this.props.beats.map((val, idx) => {
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
