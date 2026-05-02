export interface LoggerConfig {
  BASE_URL: string;
  AUTH_ENDPOINT: string;
  LOGS_ENDPOINT: string;
  authCredentials?: Record<string, any>;
}

export const config: LoggerConfig = {
  BASE_URL: 'http://20.207.122.201/evaluation-service',
  AUTH_ENDPOINT: '/auth',
  LOGS_ENDPOINT: '/logs',
  authCredentials: {}, 
};

export function configureLogger(newConfig: Partial<LoggerConfig>) {
  Object.assign(config, newConfig);
}
