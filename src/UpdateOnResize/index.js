import { h, Component } from 'preact';

export default class UpdateOnResize extends Component {
    doIt = () => {
        this.props.action();
    }
    componentDidMount() {
        window.addEventListener('resize', this.doIt);
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.DoIt);
    }
    render() {
        return <span>{this.props.children}</span>;
    }
}
