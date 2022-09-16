# discount-launchdarkly

a cobbled together alternative UI to launchdarkly, allowing read/write access via LD's REST API

### setup

clone it and install deps:

```
git clone https://github.com/6/discount-launchdarkly.git
cd discount-launchdarly
yarn
```

create `.env` (see `.env.sample`) and set `REACT_APP_LAUNCHDARKLY_ACCESS_TOKEN` env var. This LD access token must have minimum `reader` role, but ideally `writer` role for ability to create/modify flags.

this access token can be created here: https://app.launchdarkly.com/settings/authorization

### running it locally

after setup, just run `yarn start` to boot it up at http://localhost:3000
