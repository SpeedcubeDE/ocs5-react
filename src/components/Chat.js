import React, { Component } from 'react';
import PropTypes from 'prop-types';
import "./Chat.css"
import ChatMessage from "./ChatMessage";
import uuid from 'uuid';

class Chat extends Component {

    constructor() {
        super();
        this.state = {
            chatmessages: []
        };
        // this.handleChange = this.handleChange.bind(this);
        this.chatEvent = this.chatEvent.bind(this);
    }

    componentDidMount() {
        this.context.ocs.chatService.listenOnMessage(this.chatEvent);
    }

    componentWillUnmount() {
        this.context.ocs.chatService.unlistenOnMessage(this.chatEvent);
    }

    chatEvent(data) {
        const newChatmessages = this.state.chatmessages.slice();
        newChatmessages.push(data);
        this.setState({chatmessages: newChatmessages});
    }

    render() {
        const chatmessages = this.state.chatmessages
            .map(message => <ChatMessage message={message} key={uuid.v4()}/>);
        return (
            <div className="Chat">
                {chatmessages}
            </div>
        );
    }
}

Chat.contextTypes = {
    ocs: PropTypes.object
};

export default Chat;
