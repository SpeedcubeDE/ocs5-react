import Party from '../models/Party';
import SectionedPubSubEvent from "./SectionedPubSubEvent";
import PubSubEvent from "./PubSubEvent";

export default class PartiesService {
    constructor(connection) {
        this._connection = connection;
        this._parties = new Map();
        this._partyData = new Map();
        this.onPartyDataChange = new SectionedPubSubEvent();
        this.onPartylistChange = new PubSubEvent();

        connection.onEvent.listen("partylist", data => {
            this._parties.clear();
            for (const partyRaw of data.parties) {
                const party = Object.assign(new Party(), partyRaw);
                this._parties.set(party.id, party);
                this.onPartyDataChange.notify(party.id, this.getPartyForID(party.id));
            }
            this.onPartylistChange.notify(this.getParties());
        });
        connection.onEvent.listen("party", data => {
            this._partyData.set(data.id, data);
            this.onPartyDataChange.notify(data.id, this.getPartyForID(data.id));
        });
    }

    getParties() {
        return Array.from(this._parties.values());
    }

    getPartyForID(partyID) {
        if (!this._parties.has(partyID)) return null;
        let party = this._parties.get(partyID);
        party.data = this._partyData.get(partyID) || null;
        console.log("party id %s has additional data %O", partyID, party.data);
        return party;
    }

    createParty(name, ranking, cubeType, rounds, mode) {
        this._connection.send("party", {
            "action": "create",
            "name": name,
            "ranking": ranking,
            "cubeType": cubeType,
            "rounds": rounds,
            "mode": mode
        });
    }

    _partyIDAction(action, partyID) {
        this._connection.send("party", {
            "action": action,
            "partyID": partyID
        });
    }

    joinParty = id => this._partyIDAction("enter", id);
    leaveParty = id => this._partyIDAction("leave", id);
    startParty = id => this._partyIDAction("start", id);
    closeParty = id => this._partyIDAction("remove", id);

}
