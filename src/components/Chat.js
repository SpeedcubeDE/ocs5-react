import React, {Component} from 'react';
import PropTypes from 'prop-types';
import "./Chat.css"
import ChatMessage from "./ChatMessage";
import I18n from './I18n';
import RoomsService from "../business/RoomsService";

export default class Chat extends Component {
    static contextTypes = {ocs: PropTypes.object};
    
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
        this.nextScrollBehaviour = null;
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
        this.nextScrollBehaviour = "instant";
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
        this.nextScrollBehaviour = "smooth";
    }

    scrollToBottom(behavior) {
        if (this.state.anchored) {
            this.scrollAnchor.scrollIntoView({behavior: behavior});
        }
    }

    componentDidUpdate() {
        this.lastScrollOffset = this.scrollareaElement.scrollTop;
        this.scrollToBottom(this.nextScrollBehaviour == null ? "smooth" : this.nextScrollBehaviour);
        this.nextScrollBehaviour = null;
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
        this.scrollToBottom("instant");
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
        let i = 0;
        const chatmessages = this.state.chatmessages
            .slice(this.state.chatmessages.length - Chat.MAX_MESSAGES, this.state.chatmessages.length)
            .map(message => <ChatMessage message={message} key={i++}/>);
        const scrollToBottomBar = this.state.anchored
            ? null
            : <button className="scroll-to-bottom-bar" onClick={this.reanchor}>
                <I18n path="chat.autoscroll_bar_text"/></button>;
        const scrollArea = (
            <div className="scroll-area" onScroll={this.onScroll} ref={instance => this.scrollareaElement = instance}>
                {chatmessages}
                <div ref={elem => this.scrollAnchor = elem} style={{height: "12px"}}/>
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
