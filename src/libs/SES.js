const AWS = require('aws-sdk');
const config = require('../config');

const ses = new AWS.SES({
    region: 'ap-south-1',
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey
});

const sendEmail = (to, subject, body) => {
    const params = {
        Destination: {
            ToAddresses: [to],
        },
        Message: {
            Body: {
                Text: {
                    Data: body,
                },
            },
            Subject: {
                Data: subject,
            },
        },
        Source: 'your-email-address@example.com',
    };

    return ses.sendEmail(params).promise();
};

module.exports = {
    sendEmail
};
