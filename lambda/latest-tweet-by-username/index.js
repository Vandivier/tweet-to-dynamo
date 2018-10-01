const AWS = require('aws-sdk');

exports.handler = async (event, context, callback) => {
    const response = {
        statusCode: 200,
        result: JSON.stringify('Hello from Lambda! This is tweet-to-dynamo test.')
    };
    const sTwitterUsername = event.sTwitterUsername;

    if (sTwitterUsername) {
        try {
            return response;
        } catch (e) {
            callback(null, {result: 'error', errorMessage: e.stack});
        }
    } else {
        callback(null, {result: 'error', errorMessage: 'invalid Twitter username'});
    }
}
