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
        this.msg = props.message.msg.join("\n"); // TODO why is this a list?
        this.me = props.message.me;

        this.time_str = new Date(this.time * 1000)
            .toTimeString()
            .replace(/.*(\d{2}:\d{2}):\d{2}.*/, "$1");
    }

    render() {
        let part;
        if (this.userID !== UsersService.SYSTEM_USER_ID) {
            part = (
                <span>
                    <Username userID={this.userID}/>&nbsp;&ndash;&nbsp;{this.msg}
                </span>
            );
        } else {
            part = <span className="system-message">{this.msg}</span>;
        }
        return (
            <div className="ChatMessage">
                <span className="time">{this.time_str}</span>
                {part}
            </div>
        );
    }
}

ChatMessage.contextTypes = {
    ocs: PropTypes.object
};

export default ChatMessage;
