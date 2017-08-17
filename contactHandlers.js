'use strict';

var Messages = require('./Messages.js');
var ContactHelpers = require('./GooglePhoneBook.js');

var contactHandlers = {
    /*intent saveMyName: Used to save the name of the user*/
    "saveMyName": function() {
    	this.attributes['myName'] = this.event.request.intent.slots.Name.value;
    	var msg = Messages.HELLO(this);
        this.emit(":ask", msg, msg);
    },

    /* intent SMSMyLocation: Used to send the SMS to an existing contact */
    "SMSMyLocation": function() {
        var name         = this.event.request.intent.slots.Name.value;
        var userId       = this.event.session.user.userId;
        var consentToken = true; //Needs to be changed to the permission
        var location     = '';

        if(!consentToken){
            this.emit(":ask",Messages.NO_PERMISSION);
            return;
        }

        if(this.attributes['myName'] == undefined) {
            this.emit(":ask",Messages.ASK_NAME, Messages.ASK_NAME);
            return;
        }

        ContactHelpers.sendLocationToFriend(this, userId, name);

    },

    /* intent SaveMyFriendsPhone: Used to save the contact in the Database*/
    "SaveMyFriendsPhone": function() {
        var name         = this.event.request.intent.slots.Name.value;
        var phoneNum     = this.event.request.intent.slots.phoneNum.value;
        var userId       = this.event.session.user.userId;

        if(phoneNum.length != 10) {
            this.emit(":ask", Messages.INVALID_PHONE_NUMBER, Messages.INVALID_PHONE_NUMBER);
            return;
        } else {
            phoneNum = '+1'+phoneNum;
        }

        ContactHelpers.saveTheContact(this, userId, name, phoneNum);
    },

    /* intent updateMyFriendsContact: Used to update the phone number of an already saved contact in the Database. */
    "updateMyFriendsContact": function() {
        var name         = this.event.request.intent.slots.Name.value;
        var phoneNum     = this.event.request.intent.slots.phoneNum.value;
        var userId       = this.event.session.user.userId;

        if(phoneNum.length != 10) {
            this.emit(":ask", Messages.INVALID_PHONE_NUMBER, Messages.INVALID_PHONE_NUMBER);
            return;
        } else {
            phoneNum = '+1'+phoneNum;
        }

        ContactHelpers.updateTheContact(this, userId, name, phoneNum);
    },

    /* intent deleteMyFriendsContact: Used to delete the phone number of an already saved contact in the Database.*/
    "deleteMyFriendsContact": function() {
        var name         = this.event.request.intent.slots.Name.value;
        var userId       = this.event.session.user.userId;

        ContactHelpers.deleteTheContact(this, userId, name);
    }

};

module.exports = contactHandlers;