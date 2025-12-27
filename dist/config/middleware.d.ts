import cors from 'cors';
import express, { type Application } from 'express';
export declare const staticUploads: (((req: cors.CorsRequest, res: {
    statusCode?: number | undefined;
    setHeader(key: string, value: string): any;
    end(): any;
}, next: (err?: any) => any) => void) | ((req: express.Request, res: express.Response, next: express.NextFunction) => void))[];
declare const _default: (app: Application) => void;
export default _default;
//# sourceMappingURL=middleware.d.ts.map