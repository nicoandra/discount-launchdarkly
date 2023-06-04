# Fork of discount-launchdarkly

Desiged to be used through a Lambda endpoint.

Uses AWS Amplify behind the scenes.

1. Fork original repo.
2. Use Amplify Console to Host an app from Github.
3. Clone the repo locally.
4. Run `amplify pull (APP_ID) --envName staging`
5. Run `amplify push` to ensure it works.
6. Add a Cognito User Pool: `amplify add auth`
7. Build the Proxy function
8. Disable the Auth AWS_IAM and make it NONE. User validation will happen in Lambda (TODO: see if AWS can block request before spinning lambda)
9. Find the COGNITO ID

Next Steps:

1. Create different user groups: read-only, read-write, default
2. Create one secret for each user type (except default)
3. Use different keys depending on which user group is used.

# discount-launchdarkly

a cobbled together alternative UI to launchdarkly, allowing read/write access via LD API access token

<img width="600" src="https://user-images.githubusercontent.com/158675/190828170-57dc21f7-e195-4703-859f-70268118a9e3.png">

### setup

make sure you have a recent version of node.js installed

clone this repo and install deps:

```
git clone https://github.com/6/discount-launchdarkly.git
cd discount-launchdarkly
yarn
```

create `.env` (see `.env.sample`) and set `REACT_APP_LAUNCHDARKLY_ACCESS_TOKEN` env var. This LD access token must have minimum `reader` role, but ideally `writer` role for ability to create/modify flags.

this access token can be created here: https://app.launchdarkly.com/settings/authorization

### running it locally

after setup, just run `yarn start` to boot it up at http://localhost:3000
