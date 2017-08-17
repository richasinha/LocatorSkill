'use strict';

var Messages = require('./Messages.js');

var stateHandlers = {

    "NewSession": function() {
        if (this.event.request.type === "LaunchRequest") {
           this.emit("LaunchRequest");
        } else if (this.event.request.type === "IntentRequest") {
            this.emit(this.event.request.intent.name);
        }
    },

    "LaunchRequest": function() {
        var msg = Messages.WELCOME;
        msg += "What would you like to do?";
        this.emit(":ask", msg, msg);
    },

    "SessionEndedRequest": function() {
        this.emit(":tell", Messages.GOODBYE);
        console.info("Ending session Handler");
    },

    "AMAZON.CancelIntent": function() {
        this.emit(":tell", Messages.GOODBYE);
        console.info("Ending CacnelHandler");
    },

    "AMAZON.StopIntent": function() {
        this.emit(":tell", Messages.GOODBYE);
        console.info("Ending Stop Handler");
    },

    "AMAZON.HelpIntent": function() {
        this.emit(":ask", Messages.HELP);
    },

    "Unhandled": function() {
        this.emit(":ask", Messages.UNHANDLED, Messages.UNHANDLED);
    }

};

module.exports = stateHandlers;