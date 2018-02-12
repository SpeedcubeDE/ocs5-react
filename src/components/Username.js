import React, {Component} from 'react';
import "./Username.css"
import PropTypes from "prop-types";

class Username extends Component {
    constructor(props, context) {
        super(props, context);
        this.userID = props.userID;
        let userdata = context.ocs.usersService.getUserOrDummy(this.userID);
        this.state = {
            userdata: userdata
        };
        this.handleUserdataUpdate = this.handleUserdataUpdate.bind(this);
    }

    componentDidMount() {
        this.context.ocs.usersService.onUserdataChanged.listen(this.userID, this.handleUserdataUpdate);
    }

    componentWillUnmount() {
        this.context.ocs.usersService.onUserdataChanged.unlisten(this.userID, this.handleUserdataUpdate);
    }

    handleUserdataUpdate(userdata) {
        this.setState({userdata: userdata});
    }

    render() {
        const user = this.state.userdata;
        const selfmark = this.context.ocs.usersService.getCurrentUser().id === this.userID ? "» " : "";
        let cssClasses = "Username user-" + this.userID;
        if (!user.connected) cssClasses += " offline";
        return (
            <span className={cssClasses}>
                {selfmark}{user.username}
            </span>
        );
    }
}

Username.contextTypes = {
    ocs: PropTypes.object
};

export default Username;
