import React, {Component} from 'react';
import PropTypes from 'prop-types';
import I18n from "./I18n";

class ChatInput extends Component {
    constructor() {
        super();
        this.state = {
            inputText: ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        this.setState({inputText: e.target.value});
    }

    handleSubmit(e) {
        e.preventDefault();
        this.context.ocs.chatService.sendMessage(1, this.state.inputText);
        this.setState({inputText: ""});
    }

    render() {
        return (
            <div className="ChatInput">
                <form onSubmit={this.handleSubmit}>
                    <I18n path="chat.input_placeholder" setprop="placeholder"><input
                        className="ChatInput"
                        value={this.state.inputText}
                        onChange={this.handleChange}
                    /></I18n>
                </form>
            </div>
        );
    }
}

ChatInput.contextTypes = {
    ocs: PropTypes.object
};

export default ChatInput;
