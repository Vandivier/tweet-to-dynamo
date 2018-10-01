const AWS = require('aws-sdk');
const OAuth= require('oauth').OAuth;

oa = new OAuth("https://twitter.com/oauth/request_token",
                 "https://twitter.com/oauth/access_token", 
                 process.env.consumer_key, process.env.consumer_secret, 
                 "1.0A", null, "HMAC-SHA1");

dynamodb = new AWS.DynamoDB({
        "accessKeyId": process.env.dynamo_access_key_id,
        "secretAccessKey": process.env.dynamo_secret_access_key,
        "region": "us-east-2" // ohio
    });

exports.handler = async (event, context, callback) => {
    const response = {
        statusCode: 200,
        result: '',
        sLatestTweetText: '',
        sTwitterUsername: event.sTwitterUsername
    };
    const sTwitterUsername = event.sTwitterUsername;

    if (sTwitterUsername) {
        try {
            await new Promise(async function(resolve, reject) {
                oa.get(('https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=' + sTwitterUsername + '&count=1'),
                process.env.access_token,
                process.env.access_token_secret,
                async function(error, data) {
                    console.log(data[0]);
                    response.siIdTweet = new Date().getTime().toString();
                    response.sLatestTweetText = JSON.parse(data)[0].text;
                    callback(null, response);
                    if (response.sLatestTweetText) await fpPutTweet(response);
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

function fpPutTweet(_response) {
    const params = {
        Item: {
            "idTweet": {
                N: _response.siIdTweet
            },
            "sTwitterUsername": {
                S: _response.sTwitterUsername
            },
            "sLatestTweetText": {
                S: _response.sLatestTweetText
            },
        },
        TableName: "dynamo-s3-tweet-to-dynamo"
       };

    return new Promise(function(_resolve, _reject) {
        dynamodb.putItem(params, function(err, _data) {
            if (err) console.log(err, err.stack);   // an error occurred
            else     console.log(_data);            // successful response
            _resolve(_data);
        });
    });
}
