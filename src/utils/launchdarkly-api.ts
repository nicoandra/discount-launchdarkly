import fetch from 'isomorphic-fetch';
import lodash from 'lodash';
import { FlagItem } from 'hooks/use-list-flags/types';

export enum LaunchDarklyProject {
  DEFAULT = 'default',
  ORDERUP = 'orderup',
}

export interface LaunchDarklyApiFetchProps {
  path: string;
  query?: Record<string, string | null>;
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: BodyInit | null | undefined;
  skip?: boolean;
  headers?: Record<string, string>;
}

class LaunchDarklyApi {
  apiKey: string;

  constructor() {
    this.apiKey = process.env.REACT_APP_LAUNCHDARKLY_API_KEY as string;
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
    const pathWithPrefix = path.startsWith('/') ? path : `/${path}`;
    let url = `https://app.launchdarkly.com${pathWithPrefix}`;
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
        Authorization: this.apiKey,
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
    projectKey: LaunchDarklyProject;
    flagKey: string;
    operations: Array<{
      op: 'replace' | 'add'; // e.g. "replace". "remove"?
      path: string; // e.g. "/description"
      value: string | number | boolean; // "new value"
    }>;
    comment: string;
  }): Promise<FlagItem | null> {
    return launchDarklyApi.fetch<FlagItem | null>({
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
  }: {
    projectKey: LaunchDarklyProject;
    flagKey: string;
    environmentKey: string;
    instructions: Array<Record<string, any>>;
    comment?: string;
  }): Promise<FlagItem | null> {
    return launchDarklyApi.fetch<FlagItem | null>({
      path: `/api/v2/flags/${projectKey}/${flagKey}`,
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

export const launchDarklyApi = new LaunchDarklyApi();
