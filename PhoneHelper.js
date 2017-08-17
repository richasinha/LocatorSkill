'use strict';
var AWS            = require("aws-sdk");
var $q             = require('q');
var Messages       = require('./Messages.js');
var key            = "AIzaSyAax18mYqA4vcfZ3O6WAsOTHmMlfJOwW7k"; //The google API key
var mapsClient     = require('@google/maps').createClient({
    Promise: $q.Promise,
    key: key
});


const ifContactExists = function(phoneMap, name){
    for(var indx=0; indx < phoneMap.length; indx++ ) {
        if(phoneMap[indx].name == name) {
            return[true, indx];
        }
    }
    return [false,0];
}

const sendMessage = function(location, alexa, toSMS, name, callback) {
    mapsClient.geocode({
        address: location
    }, function(err, response) {
  	    if (!err) {
            var currentLocation = String(response.json.results[0].formatted_address);
            var SNS = new AWS.SNS();
            var bodyText = Messages.SMS(alexa, name, currentLocation, location);
            const params = {
                PhoneNumber: toSMS,
                Message: bodyText
            };
            SNS.publish(params, callback);
        } else {
        alexa.emit(":ask",Messages.ERROR + Messages.ERROR_GET_POSITION);
        }
    });
}

module.exports = {
    "ifContactExists": ifContactExists,
    "sendMessage": sendMessage
};
