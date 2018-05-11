import React, {Component} from 'react';
import PropTypes from 'prop-types';
import I18n from "./I18n";
import "./ChatInput.css"
import {
    addFullscreenChangeListener,
    exitFullscreen,
    isFullscreen,
    removeFullscreenChangeListener,
    requestFullscreen
} from "../business/FullscreenPolyfill";

export default class ChatInput extends Component {
    static contextTypes = {ocs: PropTypes.object};

    constructor() {
        super();
        this.state = {
            inputText: ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleTextareaEnter = this.handleTextareaEnter.bind(this);
        this.onFullscreenChange = this.onFullscreenChange.bind(this);
    }

    componentDidMount() {
        addFullscreenChangeListener(this.onFullscreenChange);
    }

    componentWillUnmount() {
        removeFullscreenChangeListener(this.onFullscreenChange);
    }

    onFullscreenChange() {
        this.forceUpdate();
    }

    handleChange(e) {
        this.setState({inputText: e.target.value});
    }

    handleSubmit(e) {
        e.preventDefault();
        this.context.ocs.chatService.sendMessage(this.context.ocs.roomsService.getSelectedRoomID(), this.state.inputText);
        this.setState({inputText: ""});
    }

    handleTextareaEnter(e) {
        if (e.keyCode === 13 && !e.ctrlKey && !e.shiftKey) {
            this.handleSubmit(e);
            return false;
        }
        return true;
    }

    static onFullscreenClick() {
        if (isFullscreen()) {
            exitFullscreen();
        } else {
            requestFullscreen();
        }
    }

    render() {
        const fullscreenButton = isFullscreen()
            ? <i className="fas fa-compress" style={{fontSize: "1.5em"}}/>
            : <i className="fas fa-expand" style={{fontSize: "1.5em"}}/>;
        return (
            <div className="ChatInput">
                <form onSubmit={this.handleSubmit}>
                    <I18n path="chat.input_placeholder" setprop="placeholder"><textarea
                        className="textInput"
                        value={this.state.inputText}
                        onChange={this.handleChange}
                        onKeyDown={this.handleTextareaEnter}
                    /></I18n>
                    <I18n path="chat.submit" setprop="value">
                        <input type="submit"/>
                    </I18n>
                    <button className="rounded-right" onClick={ChatInput.onFullscreenClick}>{fullscreenButton}</button>
                </form>
            </div>
        );
    }
}
