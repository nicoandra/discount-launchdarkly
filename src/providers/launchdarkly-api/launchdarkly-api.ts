import fetch from 'isomorphic-fetch';
import lodash from 'lodash';
import { FlagItem } from 'hooks/use-list-flags/types';
import { Auth } from 'aws-amplify';
export interface LaunchDarklyApiFetchProps {
  path: string;
  query?: Record<string, string | null>;
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: BodyInit | null | undefined;
  skip?: boolean;
  headers?: Record<string, string>;
}

export class LaunchDarklyApi {
  apiKey: string;
  cognitoUser: any;

  constructor({ apiKey, cognitoUser }: { apiKey: string; cognitoUser: any }) {
    this.apiKey = apiKey;
    this.cognitoUser = cognitoUser;
  }

  async fetch<T>({
    path,
    query,
    method,
    body,
    headers = {},
    skip = false,
  }: LaunchDarklyApiFetchProps): Promise<T | null> {
    if (skip) {
      return Promise.resolve(null);
    }

    // const loggedInUser = await Auth.currentAuthenticatedUser();
    const userJwtToken = (await Auth.currentSession()).getIdToken().getJwtToken();
    const pathWithPrefix = path.startsWith('/') ? path : `/${path}`;
    // let url = `https://app.launchdarkly.com${pathWithPrefix}`;
    let url = `${process.env.REACT_APP_PROXY_ENDPOINT}${pathWithPrefix}`;

    if (query) {
      const queryString = new URLSearchParams(
        lodash.omitBy(query, lodash.isNil) as Record<string, string>,
      ).toString();
      url = `${url}?${queryString}`;
    }
    console.info(`${method} ${url}`);
    const response = await fetch(url, {
      method,
      body,
      headers: {
        Authorization: `Bearer ${userJwtToken}`,
        ...headers,
      },
    });
    const json: T = await response.json();
    return json;
  }

  async patchFlag({
    projectKey,
    flagKey,
    operations,
    comment,
  }: {
    projectKey: string;
    flagKey: string;
    operations: Array<{
      op: 'replace' | 'add'; // e.g. "replace". "remove"?
      path: string; // e.g. "/description"
      value: string | number | boolean; // "new value"
    }>;
    comment: string;
  }): Promise<FlagItem | null> {
    return this.fetch<FlagItem | null>({
      path: `/api/v2/flags/${projectKey}/${flagKey}`,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        patch: operations,
        comment,
      }),
    });
  }

  async semanticPatchFlag({
    projectKey,
    flagKey,
    environmentKey,
    instructions,
    comment,
    ignoreConflicts,
  }: {
    projectKey: string;
    flagKey: string;
    environmentKey: string;
    instructions: Array<Record<string, any>>;
    comment?: string;
    ignoreConflicts?: boolean;
  }): Promise<FlagItem | null> {
    let query = {};
    if (ignoreConflicts) {
      query = { ignoreConflicts: true };
    }
    return this.fetch<FlagItem | null>({
      path: `/api/v2/flags/${projectKey}/${flagKey}`,
      query,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json; domain-model=launchdarkly.semanticpatch',
      },
      body: JSON.stringify({
        environmentKey: environmentKey,
        instructions,
        comment,
      }),
    });
  }
}
