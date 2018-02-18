import React, {Component} from 'react';
import "./ChatMessage.css"
import PropTypes from "prop-types";
import UsersService from "../business/UsersService";
import Username from "./Username";

class ChatMessage extends Component {
    constructor(props) {
        super(props);
        this.userID = props.message.userID;
        this.roomID = props.message.roomID;
        this.time = props.message.time;
        this.msgLines = props.message.msg;
        this.me = props.message.me;

        const date = new Date(this.time * 1000);
        this.time_str = date
            .toTimeString()
            .replace(/.*(\d{2}:\d{2}):\d{2}.*/, "$1");
        this.full_date_str = date
            .toLocaleString();
    }

    render() {
        let part;
        let i = 0;
        const msg = this.msgLines.map(msg => <span key={i++}>{msg}<br /></span>);
        if (this.userID !== UsersService.SYSTEM_USER_ID) {
            part = (
                <span className="message">
                    <Username userID={this.userID}/>&nbsp;&ndash;&nbsp;{msg}
                </span>
            );
        } else {
            part = <span className="system-message">{msg}</span>;
        }
        return (
            <div className="ChatMessage">
                <span className="time" title={this.full_date_str}>{this.time_str}</span>
                {part}
            </div>
        );
    }
}

ChatMessage.contextTypes = {
    ocs: PropTypes.object
};

export default ChatMessage;
