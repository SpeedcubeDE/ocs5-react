import React, {Component} from 'react';
import PropTypes from 'prop-types';
import I18n from "./I18n";
import "./ChatInput.css"

class ChatInput extends Component {
    constructor() {
        super();
        this.state = {
            inputText: ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleTextareaEnter = this.handleTextareaEnter.bind(this);
    }

    handleChange(e) {
        this.setState({inputText: e.target.value});
    }

    handleSubmit(e) {
        e.preventDefault();
        this.context.ocs.chatService.sendMessage(this.context.ocs.roomsService.getSelectedRoomID(), this.state.inputText);
        this.setState({inputText: ""});
    }

    handleTextareaEnter(e) {
        if (e.keyCode === 13 && !e.ctrlKey && !e.shiftKey) {
            this.handleSubmit(e);
            return false;
        }
        return true;
    }

    render() {
        return (
            <div className="ChatInput">
                <form onSubmit={this.handleSubmit}>
                    <I18n path="chat.input_placeholder" setprop="placeholder"><textarea
                        className="textInput"
                        value={this.state.inputText}
                        onChange={this.handleChange}
                        onKeyDown={this.handleTextareaEnter}
                    /></I18n>
                    <I18n path="chat.submit" setprop="value">
                        <input type="submit" className="rounded-right" />
                    </I18n>
                </form>
            </div>
        );
    }
}

ChatInput.contextTypes = {
    ocs: PropTypes.object
};

export default ChatInput;
