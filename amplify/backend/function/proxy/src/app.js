/*
Use the following code to retrieve configured secrets from SSM:

const aws = require('aws-sdk');

const { Parameters } = await (new aws.SSM())
  .getParameters({
    Names: ["LAUNCH_DARKLY_API_KEY"].map(secretName => process.env[secretName]),
    WithDecryption: true,
  })
  .promise();

Parameters will be of the form { Name: 'secretName', Value: 'secretValue', ... }[]
*/
/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

/* Amplify Params - DO NOT EDIT
	AUTH_DISCOUNTLAUNCHDARKLYBC5D3941_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const aws = require('aws-sdk');

const populateEnvironment = require('env-from-ssm');
populateEnvironment({ awsOptions: {} });

const express = require('express');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
const { CognitoJwtVerifier } = require('aws-jwt-verify');
const proxy = require('express-http-proxy');

const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.COGNITO_USER_POOL_ID,
  tokenUse: 'id',
  clientId: process.env.COGNITO_CLIENT_ID,
});

const ldProxy = proxy('https://app.launchdarkly.com/', {
  proxyReqPathResolver: function (req) {
    const newUrl = req.url.replace('/proxy/', '');
    console.log('Proxying to ', newUrl);
    return newUrl;
  },
  proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
    proxyReqOpts.headers = {
      ...srcReq.headers,
      authorization: process.env.LAUNCH_DARKLY_API_KEY,

      host: 'app.launchdarkly.com',
    };
    delete proxyReqOpts.referer;
    return proxyReqOpts;
  },
});

const app = express();
app.use(awsServerlessExpressMiddleware.eventContext());

app.use(function (req, res, next) {
  // Enable CORS for all methods
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

app.use(async function (req, res, next) {
  const jwtToken = (req.headers.authorization || '').replace('Bearer ', '');
  if (!jwtToken) {
    return res.status(403).json({ error: 'No credentials sent!' });
  }

  let payload = null;
  try {
    payload = await verifier.verify(jwtToken);
    console.log('Token is valid. Payload:', payload);
  } catch (err) {
    console.log('Token not valid:', err.message);
    return res.status(401).json({ error: 'Not authorized 1' });
  }

  if (!payload.email_verified) {
    return res.status(401).json({ error: 'Not authorized 2' });
  }

  if (!payload.email?.endsWith('@roofr.com')) {
    return res.status(401).json({ error: 'Not authorized 3' });
  }

  if (!payload['cognito:groups'].includes(process.env.COGNITO_GROUP)) {
    return res.status(401).json({ error: 'Not authorized 4' });
  }

  req.user_email = payload.email;
  req.headers.authorization = undefined;
  next();
});

const requestHandler = async function (req, res) {
  let result = 'Made it all the way here';
  res.json({
    success: result,
    url: req.url,
    reply_to: req.user_email,
    env: process.env,
  });
};

app.all('/proxy', ldProxy);
app.all('/proxy/*', ldProxy);

app.listen(3000, function () {
  console.log('App started');
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app;
