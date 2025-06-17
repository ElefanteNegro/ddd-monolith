import { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Request {
      context?: {
        requestId: string;
        timestamp: string;
        userAgent: string | undefined;
        ip: string;
      };
    }
  }
}
import { v4 as uuidv4 } from 'uuid';

export function Middleware(req: Request, res: Response, next: NextFunction): void {
  const requestId = uuidv4();
  const timestamp = new Date().toISOString();
  const { method, originalUrl, ip } = req;

  // Guardar datos útiles en el objeto request (para logs, trazabilidad, etc.)
  req['context'] = {
    requestId,
    timestamp,
    userAgent: req.headers['user-agent'],
    ip: ip || 'unknown',
  };

  console.log(`[${timestamp}] [${requestId}] ${method} ${originalUrl} - ${ip}`);

  next();
}
