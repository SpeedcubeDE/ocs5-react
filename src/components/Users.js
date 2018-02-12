import React, { Component } from 'react';
import PropTypes from 'prop-types';
import "./Users.css"
import RoomsService from "../business/RoomsService";
import Username from "./Username";

class Users extends Component {
    constructor() {
        super();
        this.state = {
            roomID: RoomsService.NO_ROOM
        };
        this.onSelectRoom = this.onSelectRoom.bind(this);
        this.onRoomChange = this.onRoomChange.bind(this);
    }

    componentDidMount() {
        this.context.ocs.roomsService.onRoomSelect.listen(this.onSelectRoom);
        this.onSelectRoom(this.context.ocs.roomsService.selectedRoom);
    }

    componentWillUnmount() {
        this.context.ocs.roomsService.onRoomSelect.unlisten(this.onSelectRoom);
    }

    onSelectRoom(roomID) {
        this.context.ocs.roomsService.onRoomChange.unlisten(this.state.roomID);
        this.context.ocs.roomsService.onRoomChange.listen(roomID, this.onRoomChange);
        this.setState({
            roomID: roomID
        });
    }

    onRoomChange() {
        this.forceUpdate();
    }

    render() {
        if (this.state.roomID === RoomsService.NO_ROOM) {
            return <div className="Users">&nbsp;</div>
        }
        const users = this.context.ocs.roomsService
            .getUserIDsForRoom(this.state.roomID)
            .map(id => this.context.ocs.usersService.getUserOrDummy(id))
            .map(user => <Username userID={user.id} key={user.id}/>);
        // TODO User-Objekte mit callbacks?
        return (
            <div className="Users">
                {users}
            </div>
        );
    }
}

Users.contextTypes = {
    ocs: PropTypes.object
};

export default Users;
