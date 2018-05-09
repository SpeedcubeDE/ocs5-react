import React, {Component} from 'react';
import PropTypes from 'prop-types';
import "./Users.css"
import RoomsService from "../business/RoomsService";
import Username from "./Username";

export default class Users extends Component {
    static contextTypes = {ocs: PropTypes.object};

    constructor() {
        super();
        this.state = {
            roomID: RoomsService.NO_ROOM
        };
        this._onSelectRoom = this._onSelectRoom.bind(this);
        this._onRoomUsersChange = this._onRoomUsersChange.bind(this);
    }

    componentDidMount() {
        this.context.ocs.roomsService.onRoomSelect.listen(this._onSelectRoom);
        this._onSelectRoom(this.context.ocs.roomsService.selectedRoom);
    }

    componentWillUnmount() {
        this.context.ocs.roomsService.onRoomSelect.unlisten(this._onSelectRoom);
    }

    _onSelectRoom(roomID) {
        this.context.ocs.roomsService.onRoomUsersChange.unlisten(this.state.roomID);
        this.context.ocs.roomsService.onRoomUsersChange.listen(roomID, this._onRoomUsersChange);
        this.setState({
            roomID: roomID
        });
    }

    _onRoomUsersChange() {
        this.forceUpdate();
    }

    render() {
        if (this.state.roomID === RoomsService.NO_ROOM) {
            return <div className="Users">&nbsp;</div>
        }
        const users = this.context.ocs.roomsService
            .getUserIDsForRoom(this.state.roomID)
            .map(id => this.context.ocs.usersService.getUserOrDummy(id))
            .map(user => {
                return (<tr key={user.id}>
                    <td className="username"><Username userID={user.id}/></td>
                    <td className="rank">{user.rank}</td>
                    <td className="status">{user.status}</td>
                </tr>);
            });
        return (
            <div className="Users">
                <table>
                    <tbody>{users}</tbody>
                </table>
            </div>
        );
    }
}
