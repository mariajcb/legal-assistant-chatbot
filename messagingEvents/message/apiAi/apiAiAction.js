const isDefined = require('../isDefined')
const sendMessage = require('../sendMessage')
const sendEmail = require('../sendEmail')

function handleApiAiAction(sender, action, responseText, contexts, parameters) {
    switch (action) {
        case "get-current-weather":
            if (parameters.hasOwnProperty("geo-city") && parameters["geo-city"] != '') {
                var request = require('request');
                request({
                    url: 'http://api.openweathermap.org/data/2.5/weather', //URL to hit
                    qs: {
                        appid: process.env.WEATHER_API_KEY,
                        q: parameters["geo-city"],
                        units: 'imperial'
                    }, //Query string data
                }, function(error, response, body) {
                    if (!error && response.statusCode == 200) {
                        let weather = JSON.parse(body);
                        if (weather.hasOwnProperty("weather")) {
                            let reply = `${responseText} ${weather["main"]["temp"]}`;
                            sendMessage.sendTextMessage(sender, reply);
                        } else {
                            sendMessage.sendTextMessage(sender,
                                `No weather forecast available for ${parameters["geo-city"]}`);
                        }
                    } else {
                        console.error(response.error);
                    }
                });
            } else {
                sendMessage.sendTextMessage(sender, responseText);
            }
            break;

        case "detailed-application":
            if (isDefined(contexts[0]) && contexts[0].name == 'job_application' && contexts[0].parameters) {
                let phone_number = (isDefined(contexts[0].parameters['phone-number']) &&
                    contexts[0].parameters['phone-number'] != '') ? contexts[0].parameters['phone-number'] : '';

                let user_name = (isDefined(contexts[0].parameters['user-name']) &&
                    contexts[0].parameters['user-name'] != '') ? contexts[0].parameters['user-name'] : '';

                let current_job = (isDefined(contexts[0].parameters['current-job']) &&
                    contexts[0].parameters['current-job'] != '') ? contexts[0].parameters['current-job'] : '';

                let years_of_experience = (isDefined(contexts[0].parameters['years-of-experience']) &&
                    contexts[0].parameters['years-of-experience'] != '') ? contexts[0].parameters['years-of-experience'] : '';

                let job_vacancy = (isDefined(contexts[0].parameters['job-vacancy']) &&
                    contexts[0].parameters['job-vacancy'] != '') ? contexts[0].parameters['job-vacancy'] : '';

                if (phone_number != '' && user_name != '' && current_job != '' && years_of_experience != '' &&
                    job_vacancy != '') {
                    let emailContent = 'A new job inquiry from ' + user_name + ' for the job: ' + job_vacancy +
                        '.<br> Current job position: ' + current_job + '.' +
                        '.<br> Years of experience: ' + years_of_experience + '.' +
                        '.<br> Phone number: ' + phone_number + '.';

                    sendEmail('New job application', emailContent);
                    // saveToDb();
                    sendMessage.sendTypingOn(sender);
                    //ask what user wants to do next
                    setTimeout(function() {
                        let buttons = [{
                            type: "web_url",
                            url: "https://mjcb-testbot.herokuapp.com/",
                            title: "Go to our website"
                        }, {
                            type: "phone_number",
                            title: "Call us",
                            payload: "+13037490038",
                        }, {
                            type: "postback",
                            title: "Keep on chatting",
                            payload: "CHAT"
                        }];

                        sendMessage.sendButtonMessage(sender, "What would you like to do next?", buttons);
                    }, 3000)
                }
            }

            sendMessage.sendTextMessage(sender, responseText)

            break;
        case "job-inquiry":
            let replies = [{
                "content_type": "text",
                "title": "Accountant",
                "payload": "Accountant"
            }, {
                "content_type": "text",
                "title": "Sales",
                "payload": "Sales"
            }, {
                "content_type": "text",
                "title": "Not interested",
                "payload": "Not interested"
            }];
            sendMessage.sendQuickReply(sender, responseText, replies);
            break;
        default:
            //unhandled action, just send back the text
            sendMessage.sendTextMessage(sender, responseText);
    }
}

module.exports = handleApiAiAction;
