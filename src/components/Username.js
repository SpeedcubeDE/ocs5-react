import React, {Component} from 'react';
import "./Username.css"
import PropTypes from "prop-types";

export default class Username extends Component {
    static contextTypes = {ocs: PropTypes.object};
    static propTypes = {userID: PropTypes.number};

    constructor(props, context) {
        super(props, context);
        const userdata = context.ocs.usersService.getUserOrDummy(props.userID);
        this.state = {
            userdata: userdata
        };
        this._onUserdataUpdate = this._onUserdataUpdate.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.userID !== this.props.userID) {
            this.context.ocs.usersService.onUserdataChanged.unlisten(prevProps.userID, this._onUserdataUpdate);
            this.context.ocs.usersService.onUserdataChanged.listen(this.props.userID, this._onUserdataUpdate);
            const userdata = this.context.ocs.usersService.getUserOrDummy(this.props.userID);
            this.setState({
                userdata: userdata
            });
        }
    }

    componentDidMount() {
        this.context.ocs.usersService.onUserdataChanged.listen(this.props.userID, this._onUserdataUpdate);
    }

    componentWillUnmount() {
        this.context.ocs.usersService.onUserdataChanged.unlisten(this.props.userID, this._onUserdataUpdate);
    }

    _onUserdataUpdate(userdata) {
        this.setState({userdata: userdata});
    }

    render() {
        const user = this.state.userdata;
        let cssClasses = "Username user-" + this.props.userID;
        if (!user.connected) cssClasses += " offline";
        const isSelf = this.context.ocs.usersService.isCurrentUser(this.props.userID);
        if (isSelf) cssClasses += " user-self";
        return (
            <span className={cssClasses}>
                {user.username}
            </span>
        );
    }
}
