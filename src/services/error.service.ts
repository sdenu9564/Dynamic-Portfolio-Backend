import httpStatus from 'http-status';

export class ExtendableError extends Error {
  public status: number;
  public isPublic: boolean;
  public isOperational: boolean;

  constructor(message: string, status: number, isPublic: boolean) {
    super(message);
    this.name = new.target.name;
    this.status = status;
    this.isPublic = isPublic;
    this.isOperational = true;
    Error.captureStackTrace(this, new.target);
  }
}

export class APIError extends ExtendableError {
  constructor(
    message: string,
    status: number = httpStatus.INTERNAL_SERVER_ERROR,
    isPublic: boolean = false
  ) {
    super(message, status, isPublic);
  }
}

interface ValidationError {
  field: string;
  messages: string[];
}

export class RequiredError {

  static makePretty(errors: ValidationError[]): Record<string, string> {
    return errors.reduce((obj, error) => {
      return {
        ...obj,
        [error.field]: error.messages[0]!.replace(/"/g, ''),
      };
    }, {});
  }


  static makeValidationsPretty(errors: Record<string, string>[]): Record<string, string> {
    return errors.reduce((obj, error) => ({ ...obj, ...error }), {});
  }
}

export default APIError;
