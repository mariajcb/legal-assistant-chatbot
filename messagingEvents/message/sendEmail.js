function sendEmail(subject, content) {
    var helper = require('sendgrid').mail

    var from_email = new helper.Email(process.env.EMAIL_FROM)
    var to_email = new helper.Email(process.env.EMAIL_TO)
    var subject = subject
    var content = new helper.Content("text/html", content)
    var mail = new helper.Mail(from_email, subject, to_email, content)

    var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
    var request = sg.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: mail.toJSON()
    });

    sg.API(request, function(error, response) {
        console.log(response.statusCode)
        console.log(response.body)
        console.log(response.headers)
    })
}

module.exports = sendEmail;
