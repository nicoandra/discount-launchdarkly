# discount-launchdarkly

a cobbled together alternative UI to launchdarkly, allowing read/write access via LD's REST API

### setup

clone it and install deps:

```
git clone https://github.com/6/discount-launchdarkly.git
cd discount-launchdarly
yarn
```

create `.env` (see `.env.sample`) with a LD API key. The key must have `writer` permission for ability to create/modify flags.

### running it locally

after setup, just run `yarn start` to boot it up at http://localhost:3000
