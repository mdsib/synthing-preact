import { h, Component } from 'preact';
import './style.css';

export default (props) => {
    console.log(props);
    return (
        <div class="Volume">
            <span class="icon-volume"></span>
            <span class="volume-triangle-container">
                <span
                    class="volume-triangle -foreground"
                    style={`transform: scale(${props.volume});`}
                ></span>
                <span class="volume-triangle -background"></span>
            </span>
        </div>
    );
};
