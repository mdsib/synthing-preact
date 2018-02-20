import { h } from 'preact';
import helpers from '../helpers';
import './style.css';

const handleToggle = (update, checked, ev) => {
    update(!checked);
}

export default (props) =>  {
    return (
        <div
            class={`${props.class} checkbox`}
            onClick={helpers.partial(handleToggle, props.update, props.checked)}
        >
            {props.checked ? <div class="checkbox-circle"></div> : null }
        </div>
    );
}
