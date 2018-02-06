import { h, Component } from 'preact';
import './style.css';

const handleAction = (action, e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.stopPropagation();
        action();
        return false;
    }
}

export default props => (
    <div
        tabindex="0"
        class={`circle-button circle${props.active ? ' active' : ''}`}
        onClick={props.action}
        onKeyDown={handleAction.bind(null, props.action)}
    >
        {props.children}
    </div>
)
