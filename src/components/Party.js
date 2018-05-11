import React, {Component} from 'react';
import "./Party.css"
import PropTypes from "prop-types";
import I18n from "./I18n";
import Username from "./Username";

export default class Party extends Component {
    static contextTypes = {ocs: PropTypes.object};
    static propTypes = {partyID: PropTypes.number};

    constructor(props, context) {
        super(props, context);
        this.state = {
            party: context.ocs.partiesService.getPartyForID(props.partyID),
        };
        this._onPartyDataChange = this._onPartyDataChange.bind(this);
        // this._onRoomSelect = this._onRoomSelect.bind(this);
        // this._onClickLeave = this._onClickLeave.bind(this);
        // this._onClickSelect = this._onClickSelect.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.partyID !== this.props.partyID) {
            console.log("adjusting listeners after componentDidUpdate");
            this.context.ocs.partiesService.onPartyDataChange.unlisten(prevProps.partyID, this._onPartyDataChange);
            this.context.ocs.partiesService.onPartyDataChange.listen(this.props.partyID, this._onPartyDataChange);
            this.setState({
                party: this.context.ocs.partiesService.getPartyForID(this.props.partyID)
            });
        }
    }

    componentDidMount() {
        this.context.ocs.partiesService.onPartyDataChange.listen(this.props.partyID, this._onPartyDataChange);
    }

    componentWillUnmount() {
        this.context.ocs.partiesService.onPartyDataChange.unlisten(this.props.partyID, this._onPartyDataChange);
    }

    _onPartyDataChange(party) {
        console.log("updating after event, now: %O", party);
        this.setState({party: party});
    }

    // _onClickLeave() {
    //     this.context.ocs.roomsService.leaveRoom(this.roomID);
    // }
    //
    // _onClickSelect() {
    //     if (!this.state.room.inRoom) {
    //         // TODO better password prompting
    //         if (this.state.room.hasPW) {
    //             const password = window.prompt("Passwort");
    //             if (password === null) {
    //                 // cancelled
    //                 return;
    //             }
    //             this.context.ocs.roomsService.joinRoom(this.roomID, password);
    //             return; // don't select it yet: joining might fail
    //         } else {
    //             this.context.ocs.roomsService.joinRoom(this.roomID, "");
    //         }
    //     }
    //     this.context.ocs.roomsService.selectRoom(this.roomID);
    // }

    render() {
        const party = this.state.party;
        const ps = this.context.ocs.partiesService;
        let actions = [];
        if (party.canEdit) {
            if (!party.closed) {
                actions.push(<button onClick={() => ps.closeParty(party.id)} className="close" key="close"><I18n
                    path="party.close"/></button>);
                if (!party.started) {
                    actions.push(<button onClick={() => ps.startParty(party.id)} className="start" key="start"><I18n
                        path="party.start"/></button>);
                }
            }
        }
        if (!party.started && !party.closed) {
            if (party.inParty) {
                actions.push(<button onClick={() => ps.leaveParty(party.id)} className="leave" key="leave"><I18n
                    path="party.leave"/></button>);
            } else {
                actions.push(<button onClick={() => ps.joinParty(party.id)} className="join" key="join"><I18n
                    path="party.join"/>
                </button>);
            }
        }
        let userIDs = [];
        if (party.data) {
            for (const result of party.data.result) {
                userIDs.push(result.userID);
            }
        }
        const users = userIDs.map(id => <Username userID={id} key={id}/>);
        const state = party.closed ? "closed" : (party.started ? "started" : "open");
        return (
            <div className="Party">
                <div className={"name " + state}>
                    {/*<FontAwesomeIcon icon={faDoorOpen}/>*/}
                    {party.name}
                </div>
                <div className="actions">
                    {actions}
                </div>
                <div className="info">
                    #{party.currentRound}/{party.rounds}, {party.cubeType}
                    {party.data ? ", " + party.data.ranking : ""}
                    {/*{JSON.stringify(party)}*/}
                </div>
                <div className="users">
                    {users.length === 0 ? "" : users.reduce((prev, curr) => [prev, ", ", curr])}
                </div>
            </div>
        );
    }
}
