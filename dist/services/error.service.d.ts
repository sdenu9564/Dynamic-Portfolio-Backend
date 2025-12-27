export declare class ExtendableError extends Error {
    status: number;
    isPublic: boolean;
    isOperational: boolean;
    constructor(message: string, status: number, isPublic: boolean);
}
export declare class APIError extends ExtendableError {
    constructor(message: string, status?: number, isPublic?: boolean);
}
interface ValidationError {
    field: string;
    messages: string[];
}
export declare class RequiredError {
    static makePretty(errors: ValidationError[]): Record<string, string>;
    static makeValidationsPretty(errors: Record<string, string>[]): Record<string, string>;
}
export default APIError;
//# sourceMappingURL=error.service.d.ts.map