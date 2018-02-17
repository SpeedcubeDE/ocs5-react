import React, {Component} from 'react';
import PropTypes from 'prop-types';

class I18n extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            text: context.ocs.i18nService.getText(props.path, props.data)
        };
        this._onLanguageChanged = this._onLanguageChanged.bind(this);
    }

    _onLanguageChanged() {
        this.setState({
            text: this.context.ocs.i18nService.getText(this.props.path, this.props.data)
        });
    }

    componentDidMount() {
        this.context.ocs.i18nService.onLanguageChanged.listen(this._onLanguageChanged)
    }

    componentWillUnmount() {
        this.context.ocs.i18nService.onLanguageChanged.unlisten(this._onLanguageChanged)
    }

    text() {
        return this.state.text;
    }

    render() {
        if (this.props.setprop !== undefined) {
            const children = React.Children.map(this.props.children,
                    child => React.cloneElement(child, {[this.props.setprop]: this.state.text}));
            return <span>{children}</span>
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
