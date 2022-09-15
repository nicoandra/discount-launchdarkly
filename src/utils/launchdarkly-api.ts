import fetch from 'isomorphic-fetch';
import lodash from 'lodash';
import { getApiKeyOrThrow } from './env';

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
}

class LaunchDarklyApi {
  apiKey: string;

  constructor() {
    this.apiKey = getApiKeyOrThrow();
  }

  async fetch<T>({
    path,
    query,
    method,
    body,
    skip,
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
      },
    });
    const json: T = await response.json();
    return json;
  }
}

export const launchDarklyApi = new LaunchDarklyApi();
