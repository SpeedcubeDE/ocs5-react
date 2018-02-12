
class UsersService {
    constructor(connection) {
        connection.listen("userlist", data => {
            data.users.forEach(user => this._handleUserdata(user));
        });
        connection.listen("user", data => {
            if (data.action === "data") {
                this._handleUserdata(data.user);
            } else {
                console.warn("Unrecognized user-event action: %O", data);
            }
        });

        this._users = new Map();
        this._onUserdataChangedCallbacks = new Map(); // userID -> callbacks
        this._onAnythingChangedCallbacks = [];

        const styleNode = document.createElement("style");
        styleNode.appendChild(document.createTextNode("")); // webkit workaround
        document.head.appendChild(styleNode);
        this._stylesheet = styleNode.sheet;
        this._stylesheetRuleindices = new Map(); // userID -> stylesheet-index
    }

    getUser(userID) {
        return this._users.get(userID);
    }

    getUserOrDummy(userID) {
        return this._users.get(userID) || {
            connected: false,
            username: "?",
            rank: "",
            status: ""
        };
    }

    listenOnUserupdate(userID, callback) {
        if (!this._onUserdataChangedCallbacks.has(userID)) {
            this._onUserdataChangedCallbacks.set(userID, [])
        }
        this._onUserdataChangedCallbacks.get(userID).push(callback);
    }

    unlistenOnUserupdate(userID, callback) {
        if (this._onUserdataChangedCallbacks.has(userID)) {
            let callbacks = this._onUserdataChangedCallbacks.get(userID);
            const index = callbacks.indexOf(callback);
            if (index >= 0) callbacks.splice(index, 1);
        }
    }

    listenOnAll(callback) {
        this._onAnythingChangedCallbacks.push(callback);
    }

    unlistenOnAll(callback) {
        const index = this._onAnythingChangedCallbacks.indexOf(callback);
        if (index >= 0) this._onAnythingChangedCallbacks.splice(index, 1);
    }

    _notifyUserupdate(user) {
        if (this._onUserdataChangedCallbacks.has(user.id)) {
            for (const callback of this._onUserdataChangedCallbacks.get(user.id)) {
                callback(user);
            }
        }
        this._onAnythingChangedCallbacks.forEach(callback => callback());
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

    _handleUserdata(user) {
        if (!UsersService._validateUserdata(user)) {
            console.error("User didn't pass validation and was ignored: %O", user);
            return;
        }
        this._users.set(user.id, user);
        const rule = `.username.user-${user.id} { color: #${user.nameColor}; }`;
        const ruleindex = this._stylesheetRuleindices.get(user.id);
        if (ruleindex === undefined) {
            const newRuleindex = this._stylesheet.insertRule(rule, this._stylesheet.cssRules.length);
            this._stylesheetRuleindices.set(user.id, newRuleindex);
        } else {
            this._stylesheet.deleteRule(ruleindex);
            this._stylesheet.insertRule(rule, ruleindex);
        }
        this._notifyUserupdate(user);
    }
}

export default UsersService;
