import React, {Component} from 'react';
import "./ChatMessage.css"
import PropTypes from "prop-types";

class ChatMessage extends Component {
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

        let userdata = this.context.ocs.usersService.users.get(this.userID)
            || this.context.ocs.usersService.dummy_user;
        this.state = {
            userdata: userdata
        };
        this.handleUserdataUpdate = this.handleUserdataUpdate.bind(this);
    }

    componentDidMount() {
        this.context.ocs.usersService.listenOnUserupdate(this.userID, this.handleUserdataUpdate);
    }

    componentWillUnmount() {
        this.context.ocs.usersService.unlistenOnUserupdate(this.userID, this.handleUserdataUpdate);
    }

    handleUserdataUpdate(userdata) {
        this.setState({userdata: userdata});
    }

    render() {
        return (
            <div className="ChatMessage">
                <span className="time">{this.time_str}</span>
                <span className={this.css_classes}>{this.state.userdata.username}: </span>
                {this.msg}
            </div>
        );
    }
}

ChatMessage.contextTypes = {
    ocs: PropTypes.object
};

export default ChatMessage;
