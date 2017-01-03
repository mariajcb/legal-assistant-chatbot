const apiai = require('apiai')

const apiAiService = apiai(process.env.API_AI_CLIENT_ACCESS_TOKEN, {
	language: "en",
	requestSource: "fb"
});

const sessionIds = new Map();

module.exports = {
  apiAiService,
  sessionIds
}
