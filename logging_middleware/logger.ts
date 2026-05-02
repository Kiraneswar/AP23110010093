import { LogStack, LogLevel, LogPackage } from './types';
import { config } from './config';
import { getToken } from './auth';

declare const process: any;

const VALID_STACKS = new Set(['backend', 'frontend']);
const VALID_LEVELS = new Set(['debug', 'info', 'warn', 'error', 'fatal']);
const VALID_BACKEND_PACKAGES = new Set(['cache', 'controller', 'cron_job', 'db', 'domain', 'handler', 'repository', 'route', 'service']);
const VALID_FRONTEND_PACKAGES = new Set(['api', 'component', 'hook', 'page', 'state', 'style']);

const colors = {
  reset: "\x1b[0m",
  debug: "\x1b[38;2;147;161;161m",
  info: "\x1b[38;2;59;130;246m",
  warn: "\x1b[38;2;245;158;11m",
  error: "\x1b[38;2;239;68;68m",
  fatal: "\x1b[48;2;153;27;27m\x1b[38;2;254;226;226m",
  stack: "\x1b[38;2;139;92;246m",
  pkg: "\x1b[38;2;16;185;129m",
};

function prettyConsoleLog(stack: string, level: string, pkg: string, message: string) {
  const isNode = typeof process !== 'undefined' && process.stdout && process.stdout.isTTY;
  if (isNode) {
    const color = colors[level as keyof typeof colors] || colors.reset;
    console.log(`${color}[${level.toUpperCase()}]${colors.reset} ${colors.stack}[${stack}]${colors.reset} ${colors.pkg}[${pkg}]${colors.reset} - ${message}`);
  } else {
    const browserColors: Record<string, string> = {
      debug: 'color: #93a1a1', info: 'color: #3b82f6', warn: 'color: #f59e0b', error: 'color: #ef4444', fatal: 'background: #991b1b; color: #fee2e2'
    };
    const c = browserColors[level] || '';
    console.log(`%c[${level.toUpperCase()}] %c[${stack}] %c[${pkg}] %c- ${message}`, c, 'color: #8b5cf6', 'color: #10b981', 'color: inherit');
  }
}

function validateInputs(stack: string, level: string, pkg: string, message: string) {
  if (!VALID_STACKS.has(stack)) {
    throw new Error(`[LoggingMiddleware] Invalid stack: '${stack}'. Must be 'backend' or 'frontend'.`);
  }
  if (!VALID_LEVELS.has(level)) {
    throw new Error(`[LoggingMiddleware] Invalid level: '${level}'. Must be one of: ${Array.from(VALID_LEVELS).join(', ')}.`);
  }
  
  if (stack === 'backend' && !VALID_BACKEND_PACKAGES.has(pkg)) {
    throw new Error(`[LoggingMiddleware] Invalid backend package: '${pkg}'. Must be one of: ${Array.from(VALID_BACKEND_PACKAGES).join(', ')}.`);
  }
  
  if (stack === 'frontend' && !VALID_FRONTEND_PACKAGES.has(pkg)) {
    throw new Error(`[LoggingMiddleware] Invalid frontend package: '${pkg}'. Must be one of: ${Array.from(VALID_FRONTEND_PACKAGES).join(', ')}.`);
  }

  if (typeof message !== 'string' || message.trim() === '') {
    throw new Error('[LoggingMiddleware] Message must be a non-empty string.');
  }
}

export async function Log(
  stack: LogStack,
  level: LogLevel,
  pkg: LogPackage,
  message: string
): Promise<void> {
  try {
    validateInputs(stack, level, pkg, message);

    const payload = {
      stack,
      level,
      package: pkg,
      message,
    };

    let token = await getToken();

    let response = await fetch(`${config.BASE_URL}${config.LOGS_ENDPOINT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (response.status === 401 || response.status === 403) {
      prettyConsoleLog('backend', 'warn', 'middleware', 'Token expired or unauthorized. Auto-refreshing token...');
      token = await getToken(true);
      
      response = await fetch(`${config.BASE_URL}${config.LOGS_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Logs API returned status ${response.status}: ${errorText}`);
    }

  } catch (error: any) {
    if (error.message && !error.message.includes('Invalid')) {
        prettyConsoleLog('backend', 'error', 'middleware', `Remote logging failed: ${error.message}`);
        prettyConsoleLog(stack, level, pkg, message);
    } else {
        throw error;
    }
  }
}
