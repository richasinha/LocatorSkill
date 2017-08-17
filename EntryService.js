'use strict';
var AWS         = require("aws-sdk");

var EntryService = function() {
    this.dynamodb = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});
}

EntryService.prototype.create = function (userId, name, phone, cb) {
    var params = {
        TableName: "phoneMapTable",
        Item: {
            "userId": userId,
            "phoneMap": [
            {
                name: name,
                phone: phone
            }
            ]
        }
    };
    this.dynamodb.put(params, cb);
};

EntryService.prototype.read = function (userId, cb) {
    var params = {
        TableName: "phoneMapTable",
        Key: {
            "userId": userId
        }
    };
    this.dynamodb.get(params, cb);
};

EntryService.prototype.append = function (userId, name, phone, cb) {
    var phoneMapToAdd = {
        name: name,
        phone: phone
    };
    this.dynamodb.update({
        TableName: "phoneMapTable",
        Key: { "userId": userId },
        UpdateExpression: "SET #phoneMap = list_append(#phoneMap, :entry)",
        ExpressionAttributeNames: { "#phoneMap": "phoneMap" },
        ExpressionAttributeValues: { ":entry": [phoneMapToAdd] },
    }, cb);
};

EntryService.prototype.delete = function (userId, indx, cb) {
    var params = {
        TableName: "phoneMapTable",
        Key: {
            "userId": userId
        },
        UpdateExpression: "REMOVE phoneMap["+indx+"]",
        ReturnValues: "UPDATED_NEW"
    };
    this.dynamodb.update(params, cb);
};

module.exports = EntryService;