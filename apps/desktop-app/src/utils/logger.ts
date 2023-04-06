// eslint-disable @typescript-eslint/no-unused-vars
import * as isDev from 'electron-is-dev';
import * as winston from 'winston';
import { app } from 'electron';
import { format } from 'util';
import { join } from 'path';

const logDirPath = isDev ? './logs/' : app.getPath('userData');

export class ElectronLogger {
  private coreLogger: winston.Logger;
  isErrorEnabled: () => boolean;
  isWarnEnabled: () => boolean;
  isInfoEnabled: () => boolean;
  isVerboseEnabled: () => boolean;
  isDebugEnabled: () => boolean;
  isSillyEnabled: () => boolean;
  error: winston.LeveledLogMethod;
  warn: winston.LeveledLogMethod;
  info: winston.LeveledLogMethod;
  http: winston.LeveledLogMethod;
  verbose: winston.LeveledLogMethod;
  debug: winston.LeveledLogMethod;
  silly: winston.LeveledLogMethod;
  child: typeof winston.child;
  log = (...message: any[]) => {
    this.coreLogger.defaultMeta = {
      service: `Electron`,
    };
    this.coreLogger.log('debug', ElectronLogger.sanitizeText(message));
  };

  constructor(private readonly context: string) {
    const winstonLogger = winston.createLogger({
      level: 'debug',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        ElectronLogger.combineMessageAndSplat(),
        winston.format.printf(
          (info) => `[ELECTRON] ${app.getVersion()} - ${info.timestamp} [${context}] ${info.level}: ${info.message}`,
        ),
      ),
      transports: [
        new winston.transports.File({
          level: 'debug',
          filename: join(logDirPath, 'app.log'),
          options: { flags: 'a' },
        }),
        ...(isDev ? [new winston.transports.Console()] : []),
      ],
    });

    Object.setPrototypeOf(this, Object.getPrototypeOf(winstonLogger));
    this.coreLogger = winstonLogger;

    for (const key of Object.keys(winstonLogger)) this[key] = winstonLogger[key];
  }

  private static combineMessageAndSplat() {
    return {
      transform(info) {
        const { [Symbol.for('splat')]: args = [], message } = info;
        const sanitizedMessage = ElectronLogger.sanitizeText([message, ...args]);
        // eslint-disable-next-line no-param-reassign
        info.message = format(sanitizedMessage);
        return info;
      },
    };
  }

  private static sanitizeText(args: any[]): string {
    return args.map((a) => (typeof a !== 'string' ? JSON.stringify(a, null, 2) : a)).join('\t');
  }
}
