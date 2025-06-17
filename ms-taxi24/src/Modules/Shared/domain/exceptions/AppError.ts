import { HttpResponseCodes } from '@Shared/HttpResponseCodes';

export class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number = HttpResponseCodes.INTERNAL_SERVER_ERROR,
    public readonly code: string = 'INTERNAL_SERVER_ERROR',
    public readonly details?: any
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  public toJSON() {
    return {
      success: false,
      message: this.message,
      code: this.code,
      details: this.details
    };
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(
      message,
      HttpResponseCodes.BAD_REQUEST,
      'VALIDATION_ERROR',
      details
    );
  }
}

export class NotFoundError extends AppError {
  constructor(message: string, details?: any) {
    super(
      message,
      HttpResponseCodes.NOT_FOUND,
      'NOT_FOUND',
      details
    );
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized', details?: any) {
    super(
      message,
      HttpResponseCodes.UNAUTHORIZED,
      'UNAUTHORIZED',
      details
    );
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden', details?: any) {
    super(
      message,
      HttpResponseCodes.FORBIDDEN,
      'FORBIDDEN',
      details
    );
  }
}

export class ConflictError extends AppError {
  constructor(message: string, details?: any) {
    super(
      message,
      HttpResponseCodes.CONFLICT,
      'CONFLICT',
      details
    );
  }
} 