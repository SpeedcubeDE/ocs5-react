import React, {Component} from 'react';
import "./Room.css"
import PropTypes from "prop-types";

class Room extends Component {
    constructor(props, context) {
        super(props, context);
        this.roomID = props.roomID;
        this.state = {
            room: context.ocs.roomsService.getRoomForID(this.roomID),
            isSelected: context.ocs.roomsService.getSelectedRoom() === this.roomID
        };
        this._onRoomDataChange = this._onRoomDataChange.bind(this);
        this._onRoomSelect = this._onRoomSelect.bind(this);
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
        this.setState({isSelected: this.context.ocs.roomsService.getSelectedRoom() === roomID});
    }

    _onClickJoin() {
        let password = null;
        if (this.state.room.hasPW) {
            password = window.prompt("Passwort");
            if (password === null) {
                // cancelled
                return;
            }
        }
        this.context.ocs.roomsService.joinRoom(this.roomID, password);
    }

    render() {
        let cssClasses = "Room";
        if (this.state.room.inRoom) cssClasses += " joined";
        if (this.state.isSelected) cssClasses += " selected";
        return (
            <div className={cssClasses}><div className="inner">
                <span className="name">{this.state.room.name}</span>
                <span className="userNum">{this.state.room.userNum}</span>
            </div></div>
        );
    }
}

Room.contextTypes = {
    ocs: PropTypes.object
};

export default Room;
