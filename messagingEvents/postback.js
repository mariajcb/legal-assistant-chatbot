const sendToApiAi = require('./message/apiAi/sendToApiAi')
const sendMessage = require('./message/sendMessage')

/*
 * Postback Event
 *
 * This event is called when a postback is tapped on a Structured Message.
 * https://developers.facebook.com/docs/messenger-platform/webhook-reference/postback-received
 *
 */
function receivedPostback(event) {
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var timeOfPostback = event.timestamp;

    // The 'payload' param is a developer-defined field which is set in a postback
    // button for Structured Messages.
    var payload = event.postback.payload;

    switch (payload) {
        case 'GET_STARTED':
            sendMessage.greetUserText(senderID);
        break;
        case 'JOB_APPLY':
            sendToApiAi(senderID, "job openings");
        break;
        case 'WEATHER':
            sendToApiAi(senderID, "weather");
        break;
        case 'CHAT':
        //user wants to keep chatting
            sendMessage.sendTextMessage(senderID, "Great!  I'm happy to chat.  Do you have any questions for me?");
        break;
        default:
        //unindentified payload
            sendMessage.sendTextMessage(senderID, "I'm not sure what you want. Can you be more specific?  You can also click on the menu to the left of the chat box.");
        break;

    }

    console.log("Received postback for user %d and page %d with payload '%s' " +
        "at %d", senderID, recipientID, payload, timeOfPostback);

}

module.exports = receivedPostback;
