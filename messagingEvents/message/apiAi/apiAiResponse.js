const isDefined = require('../isDefined')
const sendMessage = require('../sendMessage')
const handleApiAiAction = require('./apiAiAction')

function handleApiAiResponse(sender, response) {
  console.log('HANDLE API RESPONSE IS FIRING');
    let responseText = response.result.fulfillment.speech;
    let responseData = response.result.fulfillment.data;
    let messages = response.result.fulfillment.messages;
    let action = response.result.action;
    let contexts = response.result.contexts;
    let parameters = response.result.parameters;

    sendMessage.sendTypingOff(sender);

    if (isDefined(messages) && (messages.length == 1 && messages[0].type != 0 || messages.length > 1)) {
        let timeoutInterval = 1100;
        let previousType;
        let cardTypes = [];
        let timeout = 0;
        for (var i = 0; i < messages.length; i++) {

            if (messages[i].type == 1) {
                cardTypes.push(messages[i]);
            } else if (previousType == 1 && messages[i].type != 1) {
                timeout = (i - 1) * timeoutInterval;
                setTimeout(sendMessage.handleCardMessages.bind(null, cardTypes, sender), timeout);
                cardTypes = [];
                timeout = i * timeoutInterval;
                setTimeout(sendMessage.handleMessage.bind(null, messages[i], sender), timeout);
            } else {
                timeout = i * timeoutInterval;
                setTimeout(sendMessage.handleMessage.bind(null, messages[i], sender), timeout);
            }

            previousType = messages[i].type;

        }
    } else if (responseText == '' && !isDefined(action)) {
        //api ai could not evaluate input.
        console.log('Unknown query' + response.result.resolvedQuery);
        sendMessage.sendTextMessage(sender, "1 - I'm not sure what you want. Can you be more specific?");
    } else if (isDefined(action)) {
        handleApiAiAction(sender, action, responseText, contexts, parameters);
    } else if (isDefined(responseData) && isDefined(responseData.facebook)) {
        try {
            console.log('Response as formatted message' + responseData.facebook);
            sendMessage.sendTextMessage(sender, responseData.facebook);
        } catch (err) {
            sendMessage.sendTextMessage(sender, err.message);
        }
    } else if (isDefined(responseText)) {
        sendMessage.sendTextMessage(sender, responseText);
    }
}

module.exports = handleApiAiResponse;
