import React, {Component} from 'react';
import "./ChatMessage.css"
import PropTypes from "prop-types";
import UsersService from "../business/UsersService";
import Username from "./Username";

export default class ChatMessage extends Component {
    static contextTypes = {ocs: PropTypes.object};
    static propTypes = {message: PropTypes.object};

    render() {
        const date = new Date(this.props.message.time * 1000);
        this.time_str = date
            .toTimeString()
            .replace(/.*(\d{2}:\d{2}):\d{2}.*/, "$1");
        this.full_date_str = date
            .toLocaleString();

        let part;
        let i = 0;
        const msg = this.props.message.msg.map(msg => <span key={i++}>{msg}<br/></span>);
        if (this.props.message.userID === UsersService.SYSTEM_USER_ID) {
            part = <span className="system-message">{msg}</span>;
        } else if (this.props.message.me) {
            part = <span className="message me-message">
                <Username userID={this.props.message.userID}/>&nbsp;{msg}
            </span>
        } else {
            part = <span className="message">
                <Username userID={this.props.message.userID}/>&nbsp;&ndash;&nbsp;{msg}
            </span>;
        }
        return (
            <div className="ChatMessage">
                <span className="time" title={this.full_date_str}>{this.time_str}</span>
                {part}
            </div>
        );
    }
}
