import React, {Component} from 'react';
import PropTypes from 'prop-types';
import "./Parties.css"
import Party from "./Party";
import I18n from "./I18n";

export default class Parties extends Component {
    static contextTypes = {ocs: PropTypes.object};

    constructor(props, context) {
        super(props, context);
        this.state = {
            parties: context.ocs.partiesService.getParties()
        };
        this._onPartyListChange = this._onPartyListChange.bind(this);
    }

    _onPartyListChange(parties) {
        this.setState({
            parties: parties
        });
    }

    componentDidMount() {
        this.context.ocs.partiesService.onPartylistChange.listen(this._onPartyListChange);
    }

    componentWillUnmount() {
        this.context.ocs.partiesService.onPartylistChange.unlisten(this._onPartyListChange);
    }

    render() {
        const handler = () => console.log("Create new Party button clicked");
        return (
            <div className="Parties">
                <button onClick={handler} className="new-party"><I18n path="party.create"/></button>
                {this.state.parties.map(p => <Party partyID={p.id} key={p.id}/>)}
            </div>
        );
    }
}
