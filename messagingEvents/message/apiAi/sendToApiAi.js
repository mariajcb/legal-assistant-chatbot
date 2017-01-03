const apiAiService = require('./apiAiService')
const isDefined = require('../isDefined')
const handleApiAiResponse = require('./apiAiResponse')
const sendMessage = require('../sendMessage')
const receivedMessage = require('../receivedMessage')
const uuid = require('uuid');

const request = require('request');

function sendToApiAi(sender, text) {
  console.log('SENDTOAPIAI IS FIRING');
    sendMessage.sendTypingOn(sender);

    if (!apiAiService.sessionIds.has(sender)) {
        apiAiService.sessionIds.set(sender, uuid.v1());
    }

    let apiaiRequest = apiAiService.apiAiService.textRequest(text, {
        sessionId: apiAiService.sessionIds.get(sender)
    });

    apiaiRequest.on('response', (response) => {
        if (isDefined(response.result)) {
            handleApiAiResponse(sender, response);
        }
    });

    apiaiRequest.on('error', (error) => console.error(error));
    apiaiRequest.end();
}

module.exports = sendToApiAi;
