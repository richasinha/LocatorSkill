'use strict';

/**
 * This file contains a map of messages to be used by the skill.
 */

/* Custom Messages */
const WELCOME              = 'The Locator skill allows you to send your location to your friends via SMS. It allows you to save your contacts whom you can send your location any time. ';
const FIRST_TIME           = 'Please tell your name so the messages can have your signature. '
const ASK_NAME             = 'Please tell your name. Say Alexa my name is followed by your name. The messages will have that signature.';
const INVALID_PHONE_NUMBER = 'The phone number is invalid. It should be 10 digits long. ';
const NO_CONTACT_SAVED     = 'No contacts in the directory for you. Please save some contacts first. ';
const NO_PERMISSION        = 'Please enable location services for the skill. ';
const ERROR                = 'Looks like something went wrong. ';
const ERROR_GET_CONTACT    = 'Could not get contact for ';
const ERROR_GET_POSITION   = 'Could not get your current location. ';
const UNHANDLED            = 'Sorry, I could not understand your request. Please try again! ';
const HELP                 = 'You can say, Save Joe as nine four two and so on. You can ask send Joe my location. You can also update your contacts too. ';
const GOODBYE              = 'Bye! Thanks for using the locator skill. ';
const NO_CONTACT_FOR_NAME  = 'No contact saved by this name. Please save it first by saying save ';
const NO_SMS_SENT          = 'Could not send the SMS to ';
const NO_SAVE              = 'Could not save the contact for ';
const NO_UPDATE            = 'Could not update the contact for ';
const NO_DELETE            = 'Could not delete the contact for ';
const SMS_SENT             = 'Successfully sent SMS to your contact ';
const CONTACT_SAVED        = 'Successfully saved the contact for ';
const DELETE_SUCCESSFUL    = 'Deletion successful for the contact of ';
const GEOLOCATION_ABSENT   = 'No geolocation context available for your AVS device.';

const UPDATE_SUCCESSFUL = function(name, phoneNum) {
    var msg = 'Successfully updated the contact of ' + name + ' to ' + '<say-as interpret-as="telephone">'+phoneNum+'</say-as>';
    return msg;
}

const CONTACT_PRESENT = function(name, phoneNum) {
    var msg = 'The contact of ' + name + ' is already there as ' + '<say-as interpret-as="telephone">'+ phoneNum +'</say-as>' + '.';
        msg += ' Do you want to update it? Say Update ' + name + ' to followed by the number. ';
    return msg;
}

const SMS = function(alexa, name, geocodedLocation, location) {
    var textMessage = 'Hey ' + name + '! I am currently located at ' + geocodedLocation;
        textMessage += ' : Sent by your friend ' + alexa.attributes['myName'] + '\n';
        textMessage += ' http://maps.google.com/maps?q=' + location;
    return textMessage;
}

const HELLO = function(alexa) {
    var msg = 'Hey ' + alexa.attributes['myName'] + '! ';
        msg += 'What would you like to do?'
    return msg;
}

module.exports = {
    "WELCOME": WELCOME,
    "HELLO": HELLO,
    "FIRST_TIME": FIRST_TIME,
    "ASK_NAME": ASK_NAME,
    "INVALID_PHONE_NUMBER": INVALID_PHONE_NUMBER,
    "NO_CONTACT_SAVED": NO_CONTACT_SAVED,
    "NO_PERMISSION": NO_PERMISSION,
    "NO_CONTACT_FOR_NAME": NO_CONTACT_FOR_NAME,
    "NO_SMS_SENT": NO_SMS_SENT,
    "NO_SAVE": NO_SAVE,
    "NO_UPDATE": NO_UPDATE,
    "NO_DELETE": NO_DELETE,
    "SMS_SENT": SMS_SENT,
    "SMS": SMS,
    "CONTACT_SAVED": CONTACT_SAVED,
    "CONTACT_PRESENT": CONTACT_PRESENT,
    "DELETE_SUCCESSFUL": DELETE_SUCCESSFUL,
    "UPDATE_SUCCESSFUL": UPDATE_SUCCESSFUL,
    "ERROR": ERROR,
    "ERROR_GET_CONTACT": ERROR_GET_CONTACT,
    "ERROR_GET_POSITION": ERROR_GET_POSITION,
    "UNHANDLED": UNHANDLED,
    "HELP": HELP,
    "GEOLOCATION_ABSENT": GEOLOCATION_ABSENT,
    "GOODBYE": GOODBYE
};

