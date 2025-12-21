/**
 * Base class extending Error to add status and visibility control.
 */
export declare class ExtendableError extends Error {
    status: number;
    isPublic: boolean;
    isOperational: boolean;
    constructor(message: string, status: number, isPublic: boolean);
}
/**
 * Class representing an API error.
 */
export declare class APIError extends ExtendableError {
    constructor(message: string, status?: number, isPublic?: boolean);
}
/**
 * Interface describing validation error shape
 */
interface ValidationError {
    field: string;
    messages: string[];
}
/**
 * Class for formatting required/validation errors.
 */
export declare class RequiredError {
    /**
     * Transform Joi-like error arrays into a readable key-value object.
     */
    static makePretty(errors: ValidationError[]): Record<string, string>;
    /**
     * Merge multiple validation error objects into one.
     */
    static makeValidationsPretty(errors: Record<string, string>[]): Record<string, string>;
}
export default APIError;
//# sourceMappingURL=error.service.d.ts.map