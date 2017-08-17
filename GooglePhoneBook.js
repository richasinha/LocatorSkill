'use strict';
var GoogleContacts = require('google-contacts').GoogleContacts;
var Messages       = require('./Messages.js');
var phoneHelper    = require('./PhoneHelper.js');


const sendLocationToFriend = function(alexa, userId, name) {
    var accessToken    = alexa.event.session.user.accessToken;
    var googleContacts = new GoogleContacts({ token: accessToken });
    var location = '';

    if(alexa.event.context.Geolocation == undefined) {
        alexa.emit(":ask",Messages.GEOLOCATION_ABSENT);
        return;
    } else {
        var latitude = alexa.event.context.Geolocation.coordinate.latitudeInDegrees;
        var longitude = alexa.event.context.Geolocation.coordinate.longitudeInDegrees;
        location = latitude + ',' + longitude;
    }

    googleContacts.getContacts(function (err, contacts) {
        if(!err){
            if(contacts.length == 0) {
                alexa.emit(":ask",Messages.NO_CONTACT_SAVED);
                return;
            }
            var found = phoneHelper.ifContactExists(contacts, name);
            var toSMS = (found[0] == true) ? contacts[found[1]].phoneNumber : '';
            if((found[0] == false) || (toSMS == '')) {
                alexa.emit(":ask", Messages.NO_CONTACT_FOR_NAME + name);
                return;
            }

            phoneHelper.sendMessage(location, alexa, toSMS, name, function(err, resp) {
                if (err)
                    alexa.emit(":ask",Messages.NO_SMS_SENT + name +'.');
                else
                    alexa.emit(":ask",Messages.SMS_SENT + name + '.');
            });
        } else {
            console.log(err);
            alexa.emit(":ask",Messages.ERROR + Messages.ERROR_GET_CONTACT + name + '.');
        }
    });
}

/* intent SaveMyFriendsPhone: Used to save the contact */
const saveTheContact = function(alexa, userId, name, phoneNum) {
    var accessToken    = alexa.event.session.user.accessToken;
    var googleContacts = new GoogleContacts({ token: accessToken });

    googleContacts.getContacts(function(err, contacts) {
        if(!err) {
            var found = phoneHelper.ifContactExists(contacts, name);
            var toSMS = (found[0] == true) ? contacts[found[1]].phoneNumber : '';
            if(found[0] == false) {
                var params = {
                    givenName: name,
                    phoneNumber: phoneNum
                };
                googleContacts.saveContact(params, function(err, data) {
                    if(err) {
                        alexa.emit(":ask",Messages.NO_SAVE + name + '.');
                    } else {
                        alexa.emit(":ask",Messages.CONTACT_SAVED + name + '.');
                    }
                });
            } else {
                var msg = Messages.CONTACT_PRESENT(name, toSMS);
                alexa.emit(":ask", msg);
            }
        } else {
            console.log(err);
            alexa.emit(":ask", Messages.ERROR);
        }
    });
}

/* intent updateMyFriendsContact: Used to update the phone number of an already saved contact in the DynamoDB. */
const updateTheContact = function(alexa, userId, name, phoneNum) {
    var accessToken    = alexa.event.session.user.accessToken;
    var googleContacts = new GoogleContacts({ token: accessToken });

    googleContacts.getContacts(function(err, contacts) {
        if(!err) {
            if(contacts.length == 0) {
                alexa.emit(":ask",Messages.NO_CONTACT_SAVED);
            } else {
                var found = phoneHelper.ifContactExists(contacts, name);
                if(found[0] == true) {
                    var params = {
                        givenName: name,
                        phoneNumber: phoneNum,
                        etag: contacts[found[1]].etag,
                        id: contacts[found[1]].id
                    };
                    googleContacts.updateContact(params, function(err, data) {
                        if(err) {
                            console.log(err);
                            alexa.emit(":ask",Messages.NO_UPDATE + name + '.');
                        } else {
                            var msg = Messages.UPDATE_SUCCESSFUL(name, phoneNum)
                            alexa.emit(":ask",msg);
                        }
                    });
                } else {
                    alexa.emit(":ask", Messages.ERROR + Messages.ERROR_GET_CONTACT + name + '.');
                }
            }
        } else {
            console.log(err);
            alexa.emit(":ask", Messages.ERROR);
        }
    });
}

/* intent deleteMyFriendsContact: Used to delete the phone number of an already saved contact in the DynamoDB.*/
const deleteTheContact = function(alexa, userId, name) {
    var accessToken    = alexa.event.session.user.accessToken;
    var googleContacts = new GoogleContacts({ token: accessToken });

    googleContacts.getContacts(function(err, contacts) {
        if(!err) {
            if(contacts.length == 0) {
                alexa.emit(":ask",Messages.NO_CONTACT_SAVED);
            } else {
                var found = phoneHelper.ifContactExists(contacts, name);
                if(found[0] == true) {
                    var params = {
                        id: contacts[found[1]].id,
                        etag: contacts[found[1]].etag
                    };
                    googleContacts.deleteContact(params, function(err, data) {
                        if (err) {
                            alexa.emit(":ask",Messages.NO_DELETE + name + '.');
                        } else {
                            alexa.emit(":ask",Messages.DELETE_SUCCESSFUL + name + '.');
                        }
                    });
                } else {
                    alexa.emit(":ask", Messages.ERROR_GET_CONTACT + name);
                }
            }
        } else {
            console.log(err);
            alexa.emit(":ask", Messages.ERROR);
        }
    });

};

module.exports = {
    "sendLocationToFriend": sendLocationToFriend,
    "saveTheContact": saveTheContact,
    "updateTheContact": updateTheContact,
    "deleteTheContact": deleteTheContact
};