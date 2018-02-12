import React, { Component } from 'react';
import PropTypes from 'prop-types';
import "./Rooms.css"

class Rooms extends Component {
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
            <div className="Rooms">
                Räume!
            </div>
        );
    }
}

Rooms.contextTypes = {
    ocs: PropTypes.object
};

export default Rooms;
