/* This skill can send SMS using the Amazon SNS service to any of the contacts saved by the user.
 * The Contact is saved in DynamoDB and persistence is maintained that way. */
'use strict';
var Alexa             = require('alexa-sdk');
var stateHandlers     = require('./stateHandlers.js');
var contactHandlers   = require('./contactHandlers.js');

exports.handler = function(event, context, callback) {
    var alexaSDK = Alexa.handler(event, context); //Setting up Alexa Object for the session.
    var appId = "amzn1.ask.skill.7894e981-07dc-47c2-919d-5164b788b650"; //The Skill ID
    alexaSDK.APP_ID = appId;
    alexaSDK.dynamoDBTableName = "geolocationInternProjectTable";
    alexaSDK.registerHandlers(stateHandlers, contactHandlers);
    alexaSDK.execute();
};

