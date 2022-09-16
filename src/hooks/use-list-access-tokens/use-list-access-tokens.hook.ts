import { useLdGet, UseLdGetAPI } from 'hooks/use-ld-get';

export interface AccessTokenItem {
  _id: string;
  ownerId: string;
  memberId: string; //
  name: string; // "Example reader token",
  description: string; // "A reader token used in testing and examples",
  creationDate: number;
  lastModified: number; // 0
  customRoleIds: Array<unknown>; //[ ],
  inlineRole: Array<unknown>; // [ ],
  role: string; // "reader",
  token: string; // "1234",
  serviceToken: boolean; // false,
  defaultApiVersion: number; // 20220603,
  lastUsed: number; //0
}

export interface ListAccessTokensResponse {
  items: Array<AccessTokenItem>;
}

export const useListAccessTokens = (): UseLdGetAPI<ListAccessTokensResponse> => {
  // https://apidocs.launchdarkly.com/tag/Access-tokens#operation/getTokens
  return useLdGet<ListAccessTokensResponse>(
    {
      path: `/api/v2/tokens`,
      method: 'GET',
    },
    [],
  );
};
