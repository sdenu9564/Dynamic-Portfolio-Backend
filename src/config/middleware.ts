import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import express, { type Application, type Request } from 'express';
import compression from 'compression';
import constants from './constants';
import cookieParser from 'cookie-parser';
import winstonInstance from './winston';
import expressWinston from 'express-winston';
import methodOverride from 'method-override';



const allowedDomains: string[] = [
  constants.ALLOWED_DOMAIN!
].filter(Boolean);


export const staticUploads = [
  // Allow frontend access to uploads
  cors({ origin: constants.ALLOWED_DOMAIN, credentials: true }),

  // Add security headers once
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  },
];


export default (app: Application): void => {
  app.use(compression());
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
  app.use(helmet());

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (!allowedDomains.includes(origin)) {
          const msg = `This site ${origin} does not have access. Only specific domains are allowed.`;
          return callback(new Error(msg), false);
        }
        return callback(null, true);
      }
    })
  );

  app.use(cookieParser());
  app.use(methodOverride());



  if (constants.isDev) {
    app.use(morgan('dev'));
    expressWinston.requestWhitelist.push('body');
    expressWinston.responseWhitelist.push('body');
    app.use(
      expressWinston.logger({
        winstonInstance,
        meta: true,
        msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
      })
    );
  }
};
