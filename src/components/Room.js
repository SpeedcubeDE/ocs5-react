import React, {Component} from 'react';
import "./Room.css"
import PropTypes from "prop-types";
import I18n from "./I18n";

class Room extends Component {
    constructor(props, context) {
        super(props, context);
        this.roomID = props.roomID;
        this.state = {
            room: context.ocs.roomsService.getRoomForID(this.roomID),
            isSelected: context.ocs.roomsService.getSelectedRoomID() === this.roomID
        };
        this._onRoomDataChange = this._onRoomDataChange.bind(this);
        this._onRoomSelect = this._onRoomSelect.bind(this);
        this._onClickLeave = this._onClickLeave.bind(this);
        this._onClickSelect = this._onClickSelect.bind(this);
    }

    componentDidMount() {
        this.context.ocs.roomsService.onRoomDataChange.listen(this.roomID, this._onRoomDataChange);
        this.context.ocs.roomsService.onRoomSelect.listen(this._onRoomSelect);
    }

    componentWillUnmount() {
        this.context.ocs.roomsService.onRoomDataChange.unlisten(this.roomID, this._onRoomDataChange);
        this.context.ocs.roomsService.onRoomSelect.unlisten(this._onRoomSelect);
    }

    _onRoomDataChange(room) {
        this.setState({room: room});
    }

    _onRoomSelect(roomID) {
        this.setState({isSelected: this.roomID === roomID});
    }

    _onClickLeave() {
        this.context.ocs.roomsService.leaveRoom(this.roomID);
    }

    _onClickSelect() {
        if (!this.state.room.inRoom) {
            // TODO better password prompting
            if (this.state.room.hasPW) {
                const password = window.prompt("Passwort");
                if (password === null) {
                    // cancelled
                    return;
                }
                this.context.ocs.roomsService.joinRoom(this.roomID, password);
                return; // don't select it yet: joining might fail
            } else {
                this.context.ocs.roomsService.joinRoom(this.roomID, "");
            }
        }
        this.context.ocs.roomsService.selectRoom(this.roomID);
    }

    render() {
        let cssClasses = "Room";
        if (this.state.room.inRoom) cssClasses += " joined";
        if (this.state.isSelected) cssClasses += " selected";
        const isWhisper = this.state.room.type === "whisper";
        if (isWhisper) cssClasses += " whisper";
        const userNum = this.state.room.userNum;
        const subrow = isWhisper
            ? <div className="userNum"><I18n path="whisper_channel"/></div>
            : <div className="userNum">{userNum} {userNum === 1 ? "user" : "users"}</div>;
        return (
            <div className={cssClasses}><div className="inner">
                <div className="opacity-blocker" />
                <div className="name" onClick={this._onClickSelect}>{this.state.room.name}</div>
                {subrow}
                <div className="button leaveButton" onClick={this._onClickLeave}>✖</div>
            </div></div>
        );
    }
}

Room.contextTypes = {
    ocs: PropTypes.object
};

export default Room;
