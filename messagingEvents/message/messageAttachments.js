const sendMessage = require('./sendMessage')

function handleMessageAttachments(messageAttachments, senderID) {
    //for now just reply
    sendMessage.sendTextMessage(senderID, "Attachment received. Thank you.");
}

module.exports = handleMessageAttachments;
