import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './App.css';
import Chat from "./components/Chat";
import Connection from "./business/Connection";
import ChatInput from "./components/ChatInput";
import OCS from "./business/OCS"

class App extends Component {
    constructor() {
        super();
        this.connection = new Connection("wss://localhost:34543/websocket");
        this.connection.listen("login", data => {
            if (data["login"]) {
                console.log("Login successful!");
            } else {
                console.log("Login failed!");
            }
        });
        setInterval(function () {
            this.connection.send("heartbeat", {});
        }.bind(this), 60000);
        this.connection.listen("open", event => {
            // TODO read login-token from cookie or something
            this.connection.send("login", {key: "2018"});
        });
        this.ocs = new OCS(this.connection);
        window.ocs = this.ocs; // expose for in-browser debugging
        this.connection.connect();
    }

    getChildContext() {
        return {ocs: this.ocs};
    }

    render() {
        return (
            <div className="App">
                <Chat/>
                <ChatInput/>
            </div>
        );
    }
}

App.childContextTypes = {
    ocs: PropTypes.object
};

export default App;
