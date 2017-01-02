'use strict';

const config = require('./config');
const express = require('express');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
const uuid = require('uuid');

const webhook = require('./routes/webhook')


// Messenger API parameters
if (!config.FB_PAGE_TOKEN) {
	throw new Error('missing FB_PAGE_TOKEN');
}
if (!config.FB_VERIFY_TOKEN) {
	throw new Error('missing FB_VERIFY_TOKEN');
}
if (!config.API_AI_CLIENT_ACCESS_TOKEN) {
	throw new Error('missing API_AI_CLIENT_ACCESS_TOKEN');
}
if (!config.FB_APP_SECRET) {
	throw new Error('missing FB_APP_SECRET');
}
if (!config.SERVER_URL) { //used for ink to static files
	throw new Error('missing SERVER_URL');
}
if (!config.SENDGRID_API_KEY) { //sending email
	throw new Error('missing SENGRID_API_KEY');
}
if (!config.EMAIL_FROM) { //sending email
	throw new Error('missing EMAIL_FROM');
}
if (!config.EMAIL_TO) { //sending email
	throw new Error('missing EMAIL_TO');
}
// if (!config.WEATHER_API_KEY) { //weather api key
// 	throw new Error('missing WEATHER_API_KEY');
// }


app.set('port', (process.env.PORT || 5000))

//verify request came from facebook
app.use(bodyParser.json({
	verify: verifyRequestSignature
}));

//serve static files in the public directory
app.use(express.static('public'));

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
	extended: false
}))

// Process application/json
app.use(bodyParser.json())

app.use('/', webhook)

function verifyRequestSignature(req, res, buf) {
	var signature = req.headers["x-hub-signature"];

	if (!signature) {
		throw new Error('Couldn\'t validate the signature.');
	} else {
		var elements = signature.split('=');
		var method = elements[0];
		var signatureHash = elements[1];

		var expectedHash = crypto.createHmac('sha1', config.FB_APP_SECRET)
			.update(buf)
			.digest('hex');

		if (signatureHash != expectedHash) {
			throw new Error("Couldn't validate the request signature.");
		}
	}
}

// function sendEmail(subject, content) {
// 	var helper = require('sendgrid').mail;
//
// 	var from_email = new helper.Email(config.EMAIL_FROM);
// 	var to_email = new helper.Email(config.EMAIL_TO);
// 	var subject = subject;
// 	var content = new helper.Content("text/html", content);
// 	var mail = new helper.Mail(from_email, subject, to_email, content);
//
// 	var sg = require('sendgrid')(config.SENGRID_API_KEY);
// 	var request = sg.emptyRequest({
// 		method: 'POST',
// 		path: '/v3/mail/send',
// 		body: mail.toJSON()
// 	});
//
// 	sg.API(request, function(error, response) {
// 		console.log(response.statusCode)
// 		console.log(response.body)
// 		console.log(response.headers)
// 	})
// }


// Spin up the server
app.listen(app.get('port'), function () {
	console.log('running on port', app.get('port'))
})
