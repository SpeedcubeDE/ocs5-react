import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './App.css';
import Chat from "./components/Chat";
import Connection from "./business/Connection";
import ChatInput from "./components/ChatInput";
import OCS from "./business/OCS"
import Cookie from 'js-cookie'

class App extends Component {
    constructor() {
        super();
        // TODO display what server you're connected to somewhere
        const serverHost = Cookie.get("serverHost") || window.location.hostname;
        this.connection = new Connection("wss://" + serverHost + ":34543/websocket");
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
        this.connection.listen("open", () => {
            const loginToken = Cookie.get("token") || "2018"; // TODO remove debug token
            this.connection.send("login", {key: loginToken});
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
