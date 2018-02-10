import React, {Component} from 'react';
import PropTypes from 'prop-types';

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
                    <input
                        className="ChatInput"
                        placeholder="chat here..."
                        value={this.state.inputText}
                        onChange={this.handleChange}
                    />
                </form>
            </div>
        );
    }
}

ChatInput.contextTypes = {
    ocs: PropTypes.object
};

export default ChatInput;
