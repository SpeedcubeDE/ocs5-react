import React, {Component} from 'react';
import PropTypes from 'prop-types';
import "./Chat.css"
import ChatMessage from "./ChatMessage";
import uuid from 'uuid';
import I18n from './I18n';
import RoomsService from "../business/RoomsService";

class Chat extends Component {
    static MAX_MESSAGES = 200;
    static UPDATE_DELAY_MS = 30;

    constructor() {
        super();
        this.state = {
            chatmessages: [],
            anchored: true
        };
        this.roomID = RoomsService.NO_ROOM;
        this.scrollAnchor = null;
        this.scrollareaElement = null;
        this.lastScrollOffset = 0;
        this.onChatMessage = this.onChatMessage.bind(this);
        this.onScroll = this.onScroll.bind(this);
        this.reanchor = this.reanchor.bind(this);
        this.unanchor = this.unanchor.bind(this);
        this.onResize = this.onResize.bind(this);
        this.onRoomSelect = this.onRoomSelect.bind(this);

        this.doUpdateNextTime = true;
        this.updateLaterTimeout = null;
    }

    componentDidMount() {
        this.context.ocs.roomsService.onRoomSelect.listen(this.onRoomSelect);
        window.addEventListener("resize", this.onResize);
    }

    componentWillUnmount() {
        this.context.ocs.roomsService.onRoomSelect.unlisten(this.onRoomSelect);
        window.removeEventListener("resize", this.onResize);
    }

    onRoomSelect(roomID) {
        this.context.ocs.chatService.onMessage.unlisten(this.roomID, this.onChatMessage);
        this.context.ocs.chatService.onMessage.listen(roomID, this.onChatMessage);
        this.roomID = roomID;
        this.setState({
            chatmessages: this.context.ocs.chatService.getMessagesForRoomID(roomID)
        });
    }

    onChatMessage(data) {
        const newChatmessages = this.state.chatmessages.slice();
        newChatmessages.push(data);
        this.setState({chatmessages: newChatmessages});
    }

    scrollToBottom() {
        if (this.state.anchored) {
            this.scrollAnchor.scrollIntoView({behavior: "smooth"});
        }
    }

    componentDidUpdate() {
        this.lastScrollOffset = this.scrollareaElement.scrollTop;
        this.scrollToBottom();
    }

    onScroll(event) {
        const scroll_offset = this.scrollareaElement.scrollTop;
        const scroll_delta = scroll_offset - this.lastScrollOffset;
        this.lastScrollOffset = scroll_offset;

        const max_scroll_offset = this.scrollareaElement.scrollHeight - this.scrollareaElement.offsetHeight;
         if (scroll_delta < 0 && event.type !== "resize") {
             // user scrolled up, un-anchor!
             this.unanchor();
         } else if (scroll_offset >= max_scroll_offset) {
              // scrolled all the way to the bottom, re-anchor
             this.reanchor();
         }
    }

    /**
     * We need to re-adjust the scrolling stuff if the window changes in size.
     * This also includes opening or closing a keyboard on mobile devices for example.
     */
    onResize(event) {
        this.onScroll(event);
        this.scrollToBottom();
    }

    unanchor() {
        if (this.state.anchored) this.setState({anchored: false});
    }

    reanchor() {
        if (!this.state.anchored) this.setState({anchored: true});
    }

    shouldComponentUpdate() {
        if (this.doUpdateNextTime) {
            this.doUpdateNextTime = false;
            return true;
        }
        this.updateLater();
        return false;
    }

    updateLater() {
        if (this.updateLaterTimeout !== null) {
            clearTimeout(this.updateLaterTimeout);
        }
        this.updateLaterTimeout = setTimeout(function () {
            this.doUpdateNextTime = true;
            this.forceUpdate();
        }.bind(this), Chat.UPDATE_DELAY_MS);
    }

    render() {
        const chatmessages = this.state.chatmessages
            .slice(this.state.chatmessages.length-Chat.MAX_MESSAGES, this.state.chatmessages.length)
            .map(message => <ChatMessage message={message} key={uuid.v4()}/>);
        const scrollToBottomBar = this.state.anchored
            ? null
            : <button className="scrollToBottomBar" onClick={this.reanchor}>
                <I18n path="chat.autoscroll_bar_text" /></button>;
        const scrollArea = (
            <div className="scrollArea" onScroll={this.onScroll} ref={instance => this.scrollareaElement = instance}>
                {chatmessages}
                <div ref={elem => this.scrollAnchor = elem}>&nbsp;</div>
            </div>
        );
        return (
            <div className="Chat">
                {scrollArea}
                {scrollToBottomBar}
            </div>
        );
    }
}

Chat.contextTypes = {
    ocs: PropTypes.object
};

export default Chat;
