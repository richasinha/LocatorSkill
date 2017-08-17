'use strict';
var Messages       = require('./Messages.js');
var phoneHelper    = require('./PhoneHelper.js');
var EntryService   = require('./EntryService.js');

const sendLocationToFriend = function(alexa, userId, name) {
    var location = '';
    var service  = new EntryService();

    if(alexa.event.context.Geolocation == undefined) {
        alexa.emit(":ask",Messages.GEOLOCATION_ABSENT);
        return;
    } else {
        var latitude = alexa.event.context.Geolocation.coordinate.latitudeInDegrees;
        var longitude = alexa.event.context.Geolocation.coordinate.longitudeInDegrees;
        location = latitude + ',' + longitude;
    }

    service.read(userId, function(err, data) {
        if(!err){
            if(data.Item == undefined) {
                alexa.emit(":ask",Messages.NO_CONTACT_SAVED, Messages.NO_CONTACT_SAVED);
                return;
            }
            var phoneMap = data.Item.phoneMap;
            var found = phoneHelper.ifContactExists(phoneMap, name);
            var toSMS = (found[0] == true) ? phoneMap[found[1]].phone : '';
            if(toSMS == '') {
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
            alexa.emit(":ask",Messages.ERROR + Messages.ERROR_GET_CONTACT);
        }
    });
}

const saveTheContact = function(alexa, userId, name, phoneNum) {
    var service  = new EntryService();

    service.read(userId, function(err, data) {
        if(data.Item == undefined) { //If there is no contact in the directory, create one
            service.create(userId, name, phoneNum, function(err, data) {
            if(err) {
                console.log(err);
                alexa.emit(":ask",Messages.NO_SAVE + name + '.');
            } else {
                alexa.emit(":ask",Messages.CONTACT_SAVED + name + '.');
            }
            });
        } else {
            var phoneMap = data.Item.phoneMap;
            var found = phoneHelper.ifContactExists(phoneMap, name);
            var toSMS = (found[0] == true) ? phoneMap[found[1]].phone : '';
            if(toSMS == '') { //The number of friend does not exist, hence add it to the list
                service.append(userId, name, phoneNum, function(err, data) {
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
        }
    });
}

const updateTheContact = function(alexa, userId, name, phoneNum) {
    var service  = new EntryService();

    service.read(userId, function(err, data) {
        if(data.Item == undefined) {
            alexa.emit(":ask",Messages.NO_CONTACT_SAVED);
        } else {
            var phoneMap = data.Item.phoneMap;
            var found = phoneHelper.ifContactExists(phoneMap, name);
            if(found[0] == true) {
                service.delete(userId, found[1], function(err, data) {
                    if (err) {
                        console.log("Error in deletion while updating");
                        alexa.emit(":ask",Messages.NO_UPDATE + name + '.');
                    } else {
                        service.append(userId, name, phoneNum, function(err, data) {
                            if(err) {
                                console.log(err);
                                alexa.emit(":ask",Messages.NO_UPDATE + name + '.');
                            } else {
                                var msg = Messages.UPDATE_SUCCESSFUL(name, phoneNum)
                                alexa.emit(":ask",msg);
                            }
                        });
                    }
                });
            } else {
                alexa.emit(":ask", Messages.ERROR + Messages.ERROR_GET_CONTACT + name + '.');
            }
        }
    });
}

const deleteTheContact = function(alexa, userId, name) {
    var service  = new EntryService();

    service.read(userId, function(err, data) {
        if(data.Item == undefined) {
            alexa.emit(":tell",Messages.NO_CONTACT_SAVED);
        } else {
            var phoneMap = data.Item.phoneMap;
            var found = phoneHelper.ifContactExists(phoneMap, name);
            if(found[0] == true) {
                service.delete(userId, found[1], function(err, data) {
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
    });
}

module.exports = {
    "sendLocationToFriend": sendLocationToFriend,
    "saveTheContact": saveTheContact,
    "updateTheContact": updateTheContact,
    "deleteTheContact": deleteTheContact
};

