import { Request, Response, NextFunction } from 'express';
import { AppError } from '@Shared/domain/exceptions/AppError';
import { HttpResponseCodes } from '@Shared/HttpResponseCodes';
import { Logger } from '@Shared/domain/interfaces/Logger';
import { container } from '@Shared/infrastructure/container';

export class ErrorHandler {
  constructor(private readonly logger: Logger = container.logger) {}

  public handle = (err: Error, req: Request, res: Response, next: NextFunction): void => {
    this.logger.error('Error occurred:', {
      error: err,
      requestId: req.context?.requestId,
      path: req.path,
      method: req.method,
      body: req.body,
      params: req.params,
      query: req.query
    });

    if (err instanceof AppError) {
      res.status(err.statusCode).json(err.toJSON());
      return;
    }

    if (err.name === 'PrismaClientKnownRequestError') {
      const prismaError = err as any;
      
      if (prismaError.code === 'P2002') {
        const field = prismaError.meta?.target?.[0] || 'field';
        res.status(HttpResponseCodes.CONFLICT).json({
          success: false,
          message: `A record with this ${field} already exists`,
          code: 'UNIQUE_CONSTRAINT_VIOLATION',
          details: { field }
        });
        return;
      }

      if (prismaError.code === 'P2025') {
        res.status(HttpResponseCodes.NOT_FOUND).json({
          success: false,
          message: 'Record not found',
          code: 'NOT_FOUND'
        });
        return;
      }
    }

    if (err.name === 'ValidationError') {
      res.status(HttpResponseCodes.BAD_REQUEST).json({
        success: false,
        message: err.message,
        code: 'VALIDATION_ERROR'
      });
      return;
    }

    if (err.name === 'JsonWebTokenError') {
      res.status(HttpResponseCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Invalid token',
        code: 'INVALID_TOKEN'
      });
      return;
    }

    if (err.name === 'TokenExpiredError') {
      res.status(HttpResponseCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Token expired',
        code: 'TOKEN_EXPIRED'
      });
      return;
    }

    res.status(HttpResponseCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR'
    });
  };
} 