import React, {Component} from 'react';
import PropTypes from 'prop-types';
import "./Parties.css"
import Party from "./Party";

export default class Parties extends Component {
    static contextTypes = {ocs: PropTypes.object};

    constructor(props, context) {
        super(props, context);
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
