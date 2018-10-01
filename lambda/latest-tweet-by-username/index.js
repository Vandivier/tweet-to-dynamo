const AWS = require('aws-sdk');
const OAuth= require('oauth').OAuth;

oa = new OAuth("https://twitter.com/oauth/request_token",
                 "https://twitter.com/oauth/access_token", 
                 process.env.consumer_key, process.env.consumer_secret, 
                 "1.0A", null, "HMAC-SHA1");

exports.handler = async (event, context, callback) => {
    const response = {
        statusCode: 200,
        result: '',
        sTwitterUsername: event.sTwitterUsername
    };
    const sTwitterUsername = event.sTwitterUsername;

    if (sTwitterUsername) {
        try {
            await new Promise(function(resolve, reject) {
                oa.get(('https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=' + sTwitterUsername + '&count=1'),
                process.env.access_token,
                process.env.access_token_secret,
                function(error, data) {

                    response.result = data;
                    callback(null, response);
                    resolve(response);
                });
            });
        } catch (e) {
            callback(null, {result: 'error', errorMessage: e.stack});
        }
    } else {
        callback(null, {result: 'error', errorMessage: 'invalid Twitter username'});
    }
}
