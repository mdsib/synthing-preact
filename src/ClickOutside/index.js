import { h, Component } from 'preact';

export default class ClickOutside extends Component {
    handleClick = (ev) => {
        if (!this.elRef.contains(ev.target)) {
            console.log('actioning');
            this.props.action();
        }
    }
    componentDidMount() {
        console.log('mounting')
        // setTimeout ensures the click event doesn't get triggered while mounting
        window.setTimeout(() => {
            document.addEventListener('click', this.handleClick);
        }, 0);
    }
    componentWillUnmount() {
        document.removeEventListener('click', this.handleClick);
    }
    render() {
        return (
            <div ref={ref => {this.elRef = ref}}>
                {this.props.children}
            </div>
        );
    }
}
