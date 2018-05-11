import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './App.css';
import Chat from "./components/Chat";
import Connection from "./business/Connection";
import ChatInput from "./components/ChatInput";
import OCS from "./business/OCS"
import Cookie from 'js-cookie'
import Users from "./components/Users";
import Rooms from "./components/Rooms";
import Parties from "./components/Parties";
import '@fortawesome/fontawesome-free-webfonts'
import '@fortawesome/fontawesome-free-webfonts/css/fa-solid.css';

export default class App extends Component {
    static childContextTypes = {ocs: PropTypes.object};

    constructor() {
        super();
        // TODO display what server you're connected to somewhere
        const serverHost = Cookie.get("serverHost") || window.location.hostname;
        const connection = new Connection("wss://" + serverHost + ":34543/websocket");
        connection.onEvent.listen("login", data => {
            if (data["login"]) {
                console.log("Login successful!");
            } else {
                console.log("Login failed!");
            }
        });
        setInterval(() => connection.send("heartbeat", {}), 60000);
        connection.onEvent.listen("open", () => {
            const loginToken = Cookie.get("token") || "2018"; // TODO remove debug token
            connection.send("login", {key: loginToken});
        });
        // TODO remove test-notifications:
        connection.onEvent.listen("alert", alert => {
            Notification.requestPermission(permission => {
                if (permission === "granted") {
                    new Notification("OCS-Alert", {
                        body: alert.msg,
                        sticky: true
                    })
                }
            })
        });
        this.ocs = new OCS(connection);
        window.ocs = this.ocs; // expose for in-browser debugging
        connection.connect();
    }

    getChildContext() {
        return {ocs: this.ocs};
    }

    render() {
        return (
            <div className="App">
                <Chat/>
                <ChatInput/>
                <Users/>
                <Parties/>
                <Rooms/>
                <button className="menu-button">
                    <i className="fas fa-bars"/>
                </button>
            </div>
        );
    }
}
