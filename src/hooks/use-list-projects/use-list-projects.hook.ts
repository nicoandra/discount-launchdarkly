import { useLdGet, UseLdGetAPI } from 'hooks/use-ld-get';

// https://apidocs.launchdarkly.com/tag/Projects#operation/getProjects

export interface ProjectItem {
  _id: string; // "57be1db38b75bf0772d11383",
  key: string; // "my-project",
  includeInSnippetByDefault: boolean; // true,
  defaultClientSideAvailability: unknown; // {},
  name: string; // "My Project",
  tags: Array<unknown>; // [],
  environments: Array<unknown>;
}
export interface ListProjectsResponse {
  totalCount: number;
  items: Array<ProjectItem>;
}

export const useListProjects = (): UseLdGetAPI<ListProjectsResponse> => {
  return useLdGet<ListProjectsResponse>(
    {
      path: `/api/v2/projects`,
      method: 'GET',
    },
    [],
  );
};
