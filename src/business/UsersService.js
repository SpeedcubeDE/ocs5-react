import SectionedPubSubEvent from "./SectionedPubSubEvent";
import User from "../models/User";

export default class UsersService {
    static SYSTEM_USER_ID = -1;

    constructor(connection) {
        this._connection = connection;
        connection.onEvent.listen("userlist", data => {
            data.users.forEach(user => this._handleUserdata(user));
        });
        connection.onEvent.listen("user", data => {
            if (data.action === "data") {
                this._handleUserdata(data.user);
            } else {
                console.warn("Unrecognized user-event action: %O", data);
            }
        });
        this._currentUserName = ""; // TODO identify by id
        connection.onEvent.listen("login", data => {
            if (data.login) {
                this._currentUserName = data.name;
            }
        });

        this._users = new Map();
        this._userDataRequests = new Set();
        this.onUserdataChanged = new SectionedPubSubEvent();

        const styleNode = document.createElement("style");
        styleNode.appendChild(document.createTextNode("")); // webkit workaround
        document.head.appendChild(styleNode);
        this._stylesheet = styleNode.sheet;
        this._stylesheetRuleindices = new Map(); // userID -> stylesheet-index
    }

    _requestUserData(userID) {
        if (userID !== UsersService.SYSTEM_USER_ID && !this._userDataRequests.has(userID)) {
            this._connection.send("user", {"action": "get", "userID": userID});
            this._userDataRequests.add(userID);
        }
    }

    getCurrentUser() {
        for (const user of this._users.values()) {
            if (user.username === this._currentUserName) {
                return user;
            }
        }
    }

    getUser(userID) {
        const user = this._users.get(userID);
        if (user === undefined) {
            this._requestUserData(userID);
        }
        return user;
    }

    getUserOrDummy(userID) {
        return this.getUser(userID) || {
            connected: false,
            username: "?",
            rank: "",
            status: ""
        };
    }

    static _validateUserdata(user) {
        // some extra validation since we do manual string interpolation for the css rules,
        // which puts us at risk for XSS-like-attacks
        let success = true;
        if (!/^[a-f0-9]{6}$/i.test(user.nameColor)) {
            console.error("Unsafe color code detected for user '%s'! " +
                "Must consist of 6 digits or letters A-F only, but was '%s'",
                user.username, user.nameColor);
            success = false;
        }
        if (typeof user.id !== "number") {
            console.error("User-ID '%s' must be a number, but was %s for user '%s'!",
                user.id, typeof user.id, user.username);
            success = false;
        }
        return success;
    }

    _handleUserdata(userRaw) {
        const user = Object.assign(new User(), userRaw);
        if (!UsersService._validateUserdata(user)) {
            console.error("User didn't pass validation and was ignored: %O", user);
            return;
        }
        this._users.set(user.id, user);
        this._userDataRequests.delete(user.id);
        const rule = `.Username.user-${user.id} { color: #${user.nameColor}; }`;
        const ruleindex = this._stylesheetRuleindices.get(user.id);
        if (ruleindex === undefined) {
            const newRuleindex = this._stylesheet.insertRule(rule, this._stylesheet.cssRules.length);
            this._stylesheetRuleindices.set(user.id, newRuleindex);
        } else {
            this._stylesheet.deleteRule(ruleindex);
            this._stylesheet.insertRule(rule, ruleindex);
        }
        this.onUserdataChanged.notify(user.id, user);
    }
}
