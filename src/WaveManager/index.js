import { h, Component } from 'preact';

export default class WaveManager extends Component {
    render() {
        return (
            <div class="wave-manager">
              <div class="buttons">
            {this.props.activated ? 'x' : ''}
                <button onClick={this.props.activate}>activate</button>
                <button onClick={this.props.remove}>remove</button>
                <button onClick={this.props.duplicate}>dupe</button>
              </div>
              <div class="beats">
                {this.props.beats.map((val, idx) => {
                    return <input type="checkbox" checked={val} onChange={(ev) => {this.props.updateBeat(idx, ev.target.checked)}}></input>
                })}
              </div>
            </div>
        );
    }
}
