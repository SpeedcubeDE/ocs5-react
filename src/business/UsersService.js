
class UsersService {
    constructor(connection) {
        this.connection = connection;
        this.connection.listen("userlist", data => {
            data.users.forEach(user => this.handleUserdata(user));
        });
        this.connection.listen("user", data => {
            if (data.action === "data") {
                this.handleUserdata(data.user);
            } else {
                console.warn("Unrecognized user-event action: %O", data);
            }
        });

        this.users = new Map();
        this.dummy_user = {
            connected: false,
            username: "?",
            rank: "",
            status: ""
        };
        this.userdata_changed_callbacks = new Map(); // userID -> callbacks

        const styleNode = document.createElement("style");
        styleNode.appendChild(document.createTextNode("")); // webkit workaround
        document.head.appendChild(styleNode);
        this.stylesheet = styleNode.sheet;
        this.stylesheet_ruleindices = new Map(); // userID -> stylesheet-Index
    }

    listenOnUserupdate(userID, callback) {
        if (!this.userdata_changed_callbacks.has(userID)) {
            this.userdata_changed_callbacks.set(userID, [])
        }
        this.userdata_changed_callbacks.get(userID).push(callback);
    }

    unlistenOnUserupdate(userID, callback) {
        if (this.userdata_changed_callbacks.has(userID)) {
            let callbacks = this.userdata_changed_callbacks.get(userID);
            const index = callbacks.indexOf(callback);
            if (index >= 0) callbacks.splice(index, 1);
        }
    }

    notifyUserupdate(user) {
        if (this.userdata_changed_callbacks.has(user.id)) {
            for (const callback of this.userdata_changed_callbacks.get(user.id)) {
                callback(user);
            }
        }
    }

    static validateUserdata(user) {
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

    handleUserdata(user) {
        if (!UsersService.validateUserdata(user)) {
            console.error("User didn't pass validation and was ignored: %O", user);
            return;
        }
        this.users.set(user.id, user);
        const rule = `.username.user-${user.id} { color: #${user.nameColor}; }`;
        const ruleindex = this.stylesheet_ruleindices.get(user.id);
        if (ruleindex === undefined) {
            const new_ruleindex = this.stylesheet.insertRule(rule);
            this.stylesheet_ruleindices.set(user.id, new_ruleindex);
        } else {
            this.stylesheet.deleteRule(ruleindex);
            this.stylesheet.insertRule(rule, ruleindex);
        }
        this.notifyUserupdate(user);
    }
}

export default UsersService;
