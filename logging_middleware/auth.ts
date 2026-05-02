import { config } from './config';

let currentToken: string | null = null;
let tokenExpiration: number | null = null;
let authPromise: Promise<string> | null = null;

const DEFAULT_EXPIRATION_MS = 55 * 60 * 1000; 

export async function getToken(forceRefresh = false): Promise<string> {
  if (!forceRefresh && currentToken && tokenExpiration && Date.now() < tokenExpiration) {
    return currentToken;
  }

  if (authPromise && !forceRefresh) {
    return authPromise;
  }

  authPromise = (async () => {
    try {
      const response = await fetch(`${config.BASE_URL}${config.AUTH_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config.authCredentials || {}),
      });

      if (!response.ok) {
        throw new Error(`Auth request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      currentToken = data.access_token || data.token || data.jwt;
      
      if (!currentToken) {
        throw new Error('Auth response did not contain a recognizable token field (access_token).');
      }

      const expiresInMs = data.expires_in ? data.expires_in * 1000 : DEFAULT_EXPIRATION_MS;
      tokenExpiration = Date.now() + expiresInMs;

      return currentToken;
    } catch (error) {
      currentToken = null;
      tokenExpiration = null;
      throw error;
    } finally {
      authPromise = null;
    }
  })();

  return authPromise;
}

export function clearToken() {
  currentToken = null;
  tokenExpiration = null;
}
