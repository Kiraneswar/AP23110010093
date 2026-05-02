export interface AuthCredentials {
  email: string;
  name: string;
  rollNo: string;
  accessCode: string;
  clientID: string;
  clientSecret: string;
}

export interface LoggerConfig {
  BASE_URL: string;
  AUTH_ENDPOINT: string;
  LOGS_ENDPOINT: string;
  authCredentials: AuthCredentials;
}

export const config: LoggerConfig = {
  BASE_URL: typeof window !== 'undefined' ? '/evaluation-service' : 'http://20.207.122.201/evaluation-service',
  AUTH_ENDPOINT: '/auth',
  LOGS_ENDPOINT: '/logs',
  authCredentials: {
    email: "kiraneswar_takkella@srmap.edu.in",
    name: "Kiraneswar takkella",
    rollNo: "ap23110010093",
    accessCode: "QkbpxH",
    clientID: "d22e1719-4334-4c84-af08-9c9954984033",
    clientSecret: "HHcuBFvSHurbFkXD"
  },
};

export function configureLogger(newConfig: Partial<LoggerConfig>) {
  Object.assign(config, newConfig);
}
