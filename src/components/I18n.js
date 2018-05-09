import React, {Component} from 'react';
import PropTypes from 'prop-types';

class I18n extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            text: context.ocs.i18nService.getText(props.path, props.data)
        };
        this._refreshText = this._refreshText.bind(this);
    }

    _refreshText() {
        this.setState({
            text: this.context.ocs.i18nService.getText(this.props.path, this.props.data)
        });
    }

    componentDidMount() {
        this.context.ocs.i18nService.onLanguageChanged.listen(this._refreshText)
    }

    componentWillUnmount() {
        this.context.ocs.i18nService.onLanguageChanged.unlisten(this._refreshText)
    }

    componentDidUpdate(prevProps) {
        if (prevProps.path !== this.props.path) {
            this._refreshText();
        }
    }

    render() {
        if (this.props.setprop !== undefined) {
            // must be exactly 1 child
            return React.cloneElement(this.props.children, {[this.props.setprop]: this.state.text});
        } else {
            if (this.props.children !== undefined) {
                console.error("I18n component for %s doesn't have a setprop property, but children: %O",
                    this.props.path, this.props.children);
            }
            return <span>{this.state.text}</span>;
        }
    }
}

I18n.contextTypes = {
    ocs: PropTypes.object
};

I18n.propTypes = {
    path: PropTypes.string,
    data: PropTypes.object,
    setprop: PropTypes.string,
};

export default I18n;
