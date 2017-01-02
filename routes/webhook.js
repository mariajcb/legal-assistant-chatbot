var express = require('express')
var router = express.Router()
var receivedAccountLink = require('../messagingEvents/accountLink')
var receivedMessage = require('../messagingEvents/message/receivedMessage')
var receivedDeliveryConfirmation = require('../messagingEvents/deliveryConfirmation')
var receivedPostback = require('../messagingEvents/postback')
var receivedMessageRead = require('../messagingEvents/messageRead')
var receivedAuthentication = require('../messagingEvents/authentication')

router.get('/test', function(req, res) {
    console.log("made it to test route");
    res.status(200).send("made it to test route and I feel good");
})

// for Facebook verification
router.get('/webhook/', function(req, res) {
    console.log("request");
    if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === config.FB_VERIFY_TOKEN) {
        res.status(200).send(req.query['hub.challenge']);
    } else {
        console.error("Failed validation. Make sure the validation tokens match.");
        res.sendStatus(403);
    }
})

/*
 * All callbacks for Messenger are POST-ed. They will be sent to the same
 * webhook. Be sure to subscribe your app to your page to receive callbacks
 * for your page.
 * https://developers.facebook.com/docs/messenger-platform/product-overview/setup#subscribe_app
 *
 */
router.post('/webhook/', function(req, res) {
    var data = req.body;
    console.log(JSON.stringify(data));

    // Make sure this is a page subscription
    if (data.object == 'page') {
        // Iterate over each entry
        // There may be multiple if batched
        data.entry.forEach(function(pageEntry) {
            var pageID = pageEntry.id;
            var timeOfEvent = pageEntry.time;

            // Iterate over each messaging event
            pageEntry.messaging.forEach(function(messagingEvent) {
                if (messagingEvent.optin) {
                    receivedAuthentication(messagingEvent);
                } else if (messagingEvent.message) {
                    receivedMessage(messagingEvent);
                } else if (messagingEvent.delivery) {
                    receivedDeliveryConfirmation(messagingEvent);
                } else if (messagingEvent.postback) {
                    receivedPostback(messagingEvent);
                } else if (messagingEvent.read) {
                    receivedMessageRead(messagingEvent);
                } else if (messagingEvent.account_linking) {
                    receivedAccountLink(messagingEvent);
                } else {
                    console.log("Webhook received unknown messagingEvent: ", messagingEvent);
                }
            });
        });

        // Assume all went well.
        // You must send back a 200, within 20 seconds
        res.sendStatus(200);
    }
});

module.exports = router
