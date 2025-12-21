import { Request, Response, NextFunction } from 'express';
interface ValidationErrorDetail {
    field: string;
    messages: string[];
}
interface ExpressError extends Error {
    status?: number;
    details?: Record<string, any> | ValidationErrorDetail[];
    errors?: Record<string, any> | ValidationErrorDetail[];
    isPublic?: boolean;
}
/**
 * Centralized Error Logging & Response Middleware
 * Logs errors in dev mode and returns clean error responses.
 */
export default function logErrorService(err: ExpressError, req: Request, res: Response, _next: NextFunction): Response;
export {};
//# sourceMappingURL=log.service.d.ts.map