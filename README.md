************************************************************************************************************************
                                    How does the skill invokation happens!
************************************************************************************************************************
Consider the intent SMSMyLocation. User wants to send his/her current location to an
saved contact.

User says: "Alexa! Send my current location to James."

Part 1:
Alexa SDK is initialized with the below parameters:
1. App ID: The skill ID
2. Table Name: DynamoDB table for session attributes
3. Handlers: Registering all the intent handlers (contactHandlers and stateHandlers)

Part 2:
Executing the Alexa SDK.
1. contactHandlers: recognizes the "SMSMyLocation" intent

Part 3:
Intent Functionality
1. Checks if the consent token is there by user. If not, then asks the user to give the skill proper permissions
2. Also checks if the sender name is saved as a session attribute. Asks user to save that first as that provides the
   signature
3. If both the checks are passed, then the sendLocationToFriend() (Contacts.js) function is called with alexa SDK,
   user Id and name of the friend as paramters

sendLocationToFriend():
1. Reads the current geolocation coordinates from the context
2. Reads the DynamoDB. This DynamoDB is initialized as a part of this function. The parameters needed to read DynamoDB
   are userID.
3. This gives all the contacts for the user in the form of a map.
4. ifContactExists() (defined in PhoneHelper.js) is called. Parameters to this function are the map retrieved from
   DynamoDB and name of the contact
5. This function returns an array with first element being true (if contact exists by the name) or false, and second
   being the index where the contact was present in the map.
6. When contact is not saved, the first element is sufficient to let the application know if it is present/absent
7. If James is saved, then the phone number of James is retrieved from the map else Alexa asks user to save that contact
   first.
8. sendMessage() (defined in PhoneHelper.js) is called. Parameters to this function are location, number, name of the
   contact.
9. sendMessage() derives the place from the location coordinates using the geocoding API.
10.sendMessage() also initializes a SNS (an AWS service) and publishes a message using the phone number and the custom
   message.
11.All callbacks are handled for errors.

************************************************************************************************************************

Files Information:

1. index.js : Have all the details on the Alexa SDK. If new Intents are introduced and modularized using newer handlers,
   we need to include them in alexaSDK.registerHandlers() part of the code. Also the skill ID and the dynamoDB table for
   session attributes can be changed here.

2. Messages.js: All the messages used throughout the session are defined here. It keeps messages at one place.

3. stateHandlers.js: All intents related to the state of the session are defined here. It handles the Launch request,
   new session, cancel, stop and others. For simplicity, saveMyName intent is also defined here which saves the user
   name in the DynamoDB to be used between different sessions.

4. EntryService.js: All DynamoDB related tasks for handling contacts such as add, update, delete and read data are
   defined in this file.

5. contactHandlers.js: All intents related to sending the location, creating a contact, remove a contact, update a
   contact.

6. Contacts.js: Helper functions which talks to DynamoDB for all the contactHandler related functions.

7. PhoneHelper.js: It has helper functions. The task to send message or check if a data exists in the directory is
   handled by the functions in this file.

************************************************************************************************************************
                                                Version II: Google Contats
************************************************************************************************************************
The modularity of the previous version helped and did not require much change for replacing DynamoDB to Google Contacts

Contacts.js is replaced by GooglePhoneBook.js. EntryService.js is no more needed as Google Contacts is taken care.

1. Contacts.js calls helper functions from GooglePhoenBook.js. This talks to google contacts API.
2. Functions from PhoneHelper.js stays the same and are used by the functions in GooglePhoneBook.js