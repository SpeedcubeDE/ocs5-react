import React, {Component} from 'react';
import PropTypes from 'prop-types';
import "./Rooms.css"
import Room from "./Room";

class Rooms extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            rooms: context.ocs.roomsService.getRooms()
        };
        this._onRoomListChange = this._onRoomListChange.bind(this);
    }

    _onRoomListChange(rooms) {
        this.setState({
            rooms: rooms
        });
    }

    componentDidMount() {
        this.context.ocs.roomsService.onRoomlistChange.listen(this._onRoomListChange)
    }

    componentWillUnmount() {
        this.context.ocs.roomsService.onRoomlistChange.unlisten(this._onRoomListChange)
    }

    render() {
        const rooms = this.state.rooms.map(room => <Room roomID={room.id} key={room.id}/>);
        return (
            <div className="Rooms">
                {rooms}
            </div>
        );
    }
}

Rooms.contextTypes = {
    ocs: PropTypes.object
};

export default Rooms;
