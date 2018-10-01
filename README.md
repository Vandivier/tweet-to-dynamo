# tweet-to-dynamo
Serverless Node app that saves tweets to Dynamo

# Setup

Just remember. Serverless is cost-efficient, not simple.

1. Create an AWS account.
2. Create an S3 bucket

    a. I called mine `s3-tweet-to-dynamo`. It's [accessible here](http://s3-tweet-to-dynamo.s3-website.us-east-2.amazonaws.com/) if you want to interact with a running instance of the app.

    b. Create with all default permissions.
    
    c. After creating it, go to its properties and turn on [static website hosting](https://docs.aws.amazon.com/AmazonS3/latest/user-guide/static-website-hosting.html).

    d. Now go to permissions and enable `Public access` to the `Everyone` group for the `List objects` feature.
3. Download and install [S3 Browser](http://s3browser.com/).
4. Add the S3 account to S3 Browser.

    a. S3 Browser has instructions for this.

    b. You will need to create an IAM user. Just give it programmatic access permission. I called mine `app-s3-tweet-to-dynamo`.

    c. To this user, add policies: ['AmazonDynamoDBFullAccess', 'AmazonS3FullAccess', 'AWSLambdaFullAccess']

    d. Also create IAM role `role-app-s3-tweet-to-dynamo` and give it the same policies.

5. Drag the content of the S3 folder from the repo and drop in the right pane of the S3 Browser GUI for the new S3 account you just added. Then visit the bucket's public URL to see the home page!

6. Create a Dynamo instance

7. Create a new Labda script

    a. Call it getLatestTweetByUsername, set runtime to Node.js v8.10, add role `role-app-s3-tweet-to-dynamo`, and upload the zip in the appropriate lambda folder.

    b. Give full lambda access role to the same IAM user you created for the S3 browser and the Dynamo instance.

    c. On the function GUI, click Actions -> Publish new version in the top-right.

8. Create a new [Twitter App](https://developer.twitter.com)

9. Create a new AWS API Gateway. Name the API `gateway-app-s3-tweet-to-dynamo`.

    a. Link create a GET request on a resource called `/tweet` and link it to your `getLatestTweetByUsername` Lambda.

    b. Deploy your API to a stage called `test`. You should be able to access the tweet endpoint at something like `https://315xhau95d.execute-api.us-east-1.amazonaws.com/test/tweet`.

    c. If you intend to go to PROD, modify the app as needed with your new stage name.

# About

Built with React 16 + MOBX via `create-react-app` ejection. More info [here](https://swizec.com/blog/mobx-with-create-react-app/swizec/7158).

# Miscellaneous Notes and Links

1. [Adding SCSS](https://medium.com/@oreofeolurin/configuring-scss-with-react-create-react-app-1f563f862724)
2. [Get latest tweet API endpoint](https://developer.twitter.com/en/docs/tweets/timelines/api-reference/get-statuses-user_timeline)
