import { h } from 'preact';
import { connect } from 'preact-redux';
import ClickOutside from '../ClickOutside/';
import './Help.css';

const setHelpOpen = (value) => ({type: 'SET_HELP_OPEN', value});

export default connect(state => ({open: state.helpOpen}), {setHelpOpen})((props) => {
    const closeIfOpen = () => {
        if (props.open)
            props.setHelpOpen(false);
    }
    const modal = props.open ? (
            <div class="help-modal">
                <ClickOutside action={closeIfOpen}>
                    <div class="help-container">
                        <h1>Help</h1>
                        <h2>Keybindings</h2>
                        <img class="keyboard" src="../../AudioKeys/images/audiokeys-mapping-rows1.jpg" />
                        <h2>About</h2>
                        Synthing allows you to experiment with and visualize a waveform's effect on generated sound. Works best in Chrome.
                        <h2>Overview</h2>
                        <ul>
                            <li>Draw on the waveform to alter it.</li>
                            <li>Use the sequencer to activate different waveforms at different times. You can mute, solo, and mix waveforms.</li>
                            <li>Press play to start the sequencer, and feel free to change the bpm to make it faster or slower.</li>
                        </ul>
                    </div>
                </ClickOutside>
            </div>
    ) : '';

    return (
        <div class="help">
            <div
                class="help-tag"
                onClick={props.setHelpOpen.bind(null, !props.open)}
            >
                ?
            </div>
            {modal}
        </div>
    );
})
