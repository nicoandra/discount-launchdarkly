import { createContext } from 'react';

export interface EnforceApiKeyPresenceContextAPI {
  apiKey: string | undefined;
}

export const EnforceApiKeyPresenceContext = createContext<EnforceApiKeyPresenceContextAPI>({
  apiKey: undefined,
});
