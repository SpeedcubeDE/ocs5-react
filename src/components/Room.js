import React, {Component} from 'react';
import "./Room.css"
import PropTypes from "prop-types";
import I18n from "./I18n";

export default class Room extends Component {
    static contextTypes = {ocs: PropTypes.object};
    static propTypes = {roomID: PropTypes.number};

    constructor(props, context) {
        super(props, context);
        this.state = Room.stateFromPropsAndContext(props, context);
        this._onRoomDataChange = this._onRoomDataChange.bind(this);
        this._onRoomSelect = this._onRoomSelect.bind(this);
        this._onClickLeave = this._onClickLeave.bind(this);
        this._onClickSelect = this._onClickSelect.bind(this);
    }

    static stateFromPropsAndContext(props, context) {
        return {
            room: context.ocs.roomsService.getRoomForID(props.roomID),
            isSelected: context.ocs.roomsService.getSelectedRoomID() === props.roomID
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.roomID !== this.props.roomID) {
            this.context.ocs.roomsService.onRoomDataChange.unlisten(prevProps.roomID, this._onRoomDataChange);
            this.context.ocs.roomsService.onRoomDataChange.listen(this.props.roomID, this._onRoomDataChange);
            this.setState(Room.stateFromPropsAndContext(this.props, this.context));
        }
    }

    componentDidMount() {
        this.context.ocs.roomsService.onRoomDataChange.listen(this.props.roomID, this._onRoomDataChange);
        this.context.ocs.roomsService.onRoomSelect.listen(this._onRoomSelect);
    }

    componentWillUnmount() {
        this.context.ocs.roomsService.onRoomDataChange.unlisten(this.props.roomID, this._onRoomDataChange);
        this.context.ocs.roomsService.onRoomSelect.unlisten(this._onRoomSelect);
    }

    _onRoomDataChange(room) {
        this.setState({room: room});
    }

    _onRoomSelect(roomID) {
        this.setState({isSelected: this.props.roomID === roomID});
    }

    _onClickLeave() {
        this.context.ocs.roomsService.leaveRoom(this.props.roomID);
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
                this.context.ocs.roomsService.joinRoom(this.props.roomID, password);
                return; // don't select it yet: joining might fail
            } else {
                this.context.ocs.roomsService.joinRoom(this.props.roomID, "");
            }
        }
        this.context.ocs.roomsService.selectRoom(this.props.roomID);
    }

    render() {
        let cssClasses = "Room";
        if (this.state.room.inRoom) cssClasses += " joined";
        if (this.state.isSelected) cssClasses += " selected";
        const isWhisper = this.state.room.type === "whisper";
        if (isWhisper) cssClasses += " whisper";
        const userNum = this.state.room.userNum;
        const subrow = isWhisper
            ? <div className="user-num"><I18n path="whisper_channel"/></div>
            : <div className="user-num">{userNum} {userNum === 1 ? "user" : "users"}</div>;
        return (
            <div className={cssClasses}>
                <div className="inner">
                    <div className="opacity-blocker"/>
                    <div className="name" onClick={this._onClickSelect}>{this.state.room.name}</div>
                    {subrow}
                    <div className="button button-leave" onClick={this._onClickLeave}>
                        <span className="fas fa-times"/>
                    </div>
                </div>
            </div>
        );
    }
}
