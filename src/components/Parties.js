import React, { Component } from 'react';
import PropTypes from 'prop-types';
import "./Parties.css"

class Parties extends Component {
    constructor() {
        super();
        this.state = {
        };
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    render() {
        return (
            <div className="Parties">
                Parties!
            </div>
        );
    }
}

Parties.contextTypes = {
    ocs: PropTypes.object
};

export default Parties;
