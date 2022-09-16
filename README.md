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
