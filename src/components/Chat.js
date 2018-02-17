import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import "./Chat.css"
import ChatMessage from "./ChatMessage";
import uuid from 'uuid';
import I18n from './I18n';

class Chat extends Component {

    constructor() {
        super();
        this.state = {
            chatmessages: [],
            anchored: true
        };
        this.scroll_anchor = null;
        this.scrollarea_dom_element = null;
        this.last_scroll_offset = 0;
        this.chatEvent = this.chatEvent.bind(this);
        this.onScroll = this.onScroll.bind(this);
        this.onReanchor = this.onReanchor.bind(this);
        this.onResize = this.onResize.bind(this);
    }

    componentDidMount() {
        this.context.ocs.chatService.onMessage.listen(this.chatEvent);
        window.addEventListener("resize", this.onResize);
        this.scrollarea_dom_element = ReactDOM.findDOMNode(this).querySelector(".scrollArea");
    }

    componentWillUnmount() {
        this.context.ocs.chatService.onMessage.unlisten(this.chatEvent);
        window.removeEventListener("resize", this.onResize);
    }

    chatEvent(data) {
        const newChatmessages = this.state.chatmessages.slice();
        newChatmessages.push(data);
        this.setState({chatmessages: newChatmessages});
    }

    scrollToBottom() {
        if (this.state.anchored) {
            this.scroll_anchor.scrollIntoView({behavior: "smooth"});
        }
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    onScroll(event) {
        const scroll_offset = this.scrollarea_dom_element.scrollTop;
        const scroll_delta = scroll_offset - this.last_scroll_offset;
        this.last_scroll_offset = scroll_offset;

        const max_scroll_offset = this.scrollarea_dom_element.scrollHeight - this.scrollarea_dom_element.offsetHeight;
         if (scroll_delta < 0 && event.type !== "resize") {
            // user scrolled up, un-anchor!
            this.setState({anchored: false});
        } else if (scroll_offset >= max_scroll_offset) {
             // scrolled all the way to the bottom, re-anchor
            this.setState({anchored: true});
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

    onReanchor() {
        this.setState({anchored: true});
    }

    render() {
        const chatmessages = this.state.chatmessages
            .map(message => <ChatMessage message={message} key={uuid.v4()}/>);
        const scrollToBottomBar = this.state.anchored
            ? null
            : <button className="scrollToBottomBar" onClick={this.onReanchor}>
                <I18n path="chat.autoscroll_bar_text" /></button>;
        const scrollArea = (
            <div className="scrollArea" onScroll={this.onScroll}>
                {chatmessages}
                <div ref={elem => {this.scroll_anchor = elem;}}>&nbsp;</div>
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
