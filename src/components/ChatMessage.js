import React, {Component} from 'react';
import "./ChatMessage.css"
import PropTypes from "prop-types";

class ChatMessage extends Component {
    static SYSTEM_USER_ID = -1;

    constructor(props, context) {
        super(props, context);
        this.userID = props.message.userID;
        this.roomID = props.message.roomID;
        this.time = props.message.time;
        this.msg = props.message.msg.join("\n"); // TODO why is this a list?
        this.me = props.message.me;

        this.time_str = new Date(this.time * 1000)
            .toTimeString()
            .replace(/.*(\d{2}:\d{2}):\d{2}.*/, "$1");
        this.css_classes = "username user-" + this.userID;

        let userdata = this.context.ocs.usersService.getUserOrDummy(this.userID);
        this.state = {
            userdata: userdata
        };
        this.handleUserdataUpdate = this.handleUserdataUpdate.bind(this);
    }

    componentDidMount() {
        if (this.userID !== ChatMessage.SYSTEM_USER_ID) {
            this.context.ocs.usersService.onUserdataChanged.listen(this.userID, this.handleUserdataUpdate);
        }
    }

    componentWillUnmount() {
        if (this.userID !== ChatMessage.SYSTEM_USER_ID) {
            this.context.ocs.usersService.onUserdataChanged.unlisten(this.userID, this.handleUserdataUpdate);
        }
    }

    handleUserdataUpdate(userdata) {
        this.setState({userdata: userdata});
    }

    render() {
        let part;
        if (this.userID !== ChatMessage.SYSTEM_USER_ID) {
            part = (
                <span>
                    <span className={this.css_classes}>{this.state.userdata.username}: </span>
                    {this.msg}
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
